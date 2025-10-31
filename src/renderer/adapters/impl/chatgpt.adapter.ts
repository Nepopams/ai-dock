import {
  AdapterConfig,
  AdapterError,
  AdapterSelectors,
  IAgentAdapter,
  WebAdapterContext
} from "../IAgentAdapter";
import { buildAdapterSelectors, selectorHeuristics } from "../selectorHeuristics";
import { domScriptTemplates, toDomScriptSource } from "../../utils/domScriptTemplates";
import { execDomScript, withTimeout } from "../adapterBridgeClient";

const pressEnterScript = toDomScriptSource(function pressEnterDom(
  selectors: string[],
  fallbackSelectors: string[]
) {
  const toUnique = (items: string[] = []) => {
    const seen = new Set<string>();
    const result: string[] = [];
    (items || []).forEach((item) => {
      const trimmed = (item || "").trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
        result.push(trimmed);
      }
    });
    return result;
  };

  const list = toUnique([...(selectors || []), ...(fallbackSelectors || [])]);
  for (const selector of list) {
    const node = document.querySelector(selector) as HTMLElement | null;
    if (!node) {
      continue;
    }
    const keyDown = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true
    });
    const keyUp = new KeyboardEvent("keyup", {
      key: "Enter",
      code: "Enter",
      bubbles: true
    });
    node.dispatchEvent(keyDown);
    node.dispatchEvent(keyUp);
    return { ok: true, selector };
  }
  return { ok: false };
});

const chatGptBaseSelectors: AdapterSelectors = {
  input: [
    "textarea[data-id='root']",
    "textarea[data-testid='textbox']",
    "textarea[placeholder*='Message']",
    "[data-testid='prompt-textarea']"
  ],
  sendButton: [
    "button[data-testid='send-button']",
    "button[aria-label*='Send']",
    "button:has(svg[data-testid*='send'])"
  ],
  messages: [
    "main .relative.flex-1",
    "main [data-testid='conversation-turns']",
    "main div:has([data-message-author-role])"
  ],
  assistantMessage: ["[data-message-author-role='assistant']"],
  userMessage: ["[data-message-author-role='user']"]
};

const defaultConfig: AdapterConfig = {
  selectors: buildAdapterSelectors(chatGptBaseSelectors),
  capabilities: {
    supportsEnterToSend: true,
    canExportHistory: true
  },
  timeoutsMs: {
    ready: 5000,
    insert: 4000,
    send: 4000,
    read: 6000
  }
};

type FindInputResult = {
  found: boolean;
  selector?: string;
};

type SetInputResult = {
  ok: boolean;
  reason?: string;
};

type ClickResult = {
  ok: boolean;
  selector?: string;
};

type AssistantMessageResult = {
  ok: boolean;
  text?: string;
};

export class ChatGptAdapter implements IAgentAdapter {
  public readonly id = "chatgpt";
  public config: AdapterConfig;
  private readonly baseSelectors: AdapterSelectors;

  constructor(baseConfig: AdapterConfig = defaultConfig) {
    this.config = baseConfig;
    this.baseSelectors = chatGptBaseSelectors;
  }

  updateSelectors(overrides?: Partial<AdapterSelectors>): void {
    const mergedOverrides: Partial<AdapterSelectors> = {
      input: [...(overrides?.input || []), ...this.baseSelectors.input],
      sendButton: [...(overrides?.sendButton || []), ...(this.baseSelectors.sendButton || [])],
      messages: [...(overrides?.messages || []), ...(this.baseSelectors.messages || [])],
      assistantMessage: [
        ...(overrides?.assistantMessage || []),
        ...(this.baseSelectors.assistantMessage || [])
      ],
      userMessage: [...(overrides?.userMessage || []), ...(this.baseSelectors.userMessage || [])]
    };
    this.config = {
      ...this.config,
      selectors: buildAdapterSelectors(mergedOverrides)
    };
  }

  private getSelectors(): AdapterSelectors {
    return this.config.selectors;
  }

  async ready(ctx: WebAdapterContext): Promise<boolean> {
    const selectors = this.getSelectors();
    const result = await withTimeout<FindInputResult>(
      execDomScript<FindInputResult>(ctx.tabId, domScriptTemplates.findInput, [
        selectors.input,
        selectorHeuristics.defaults.input
      ]),
      this.config.timeoutsMs?.ready ?? 5000,
      "TIMEOUT",
      "ChatGPT input not ready"
    );
    return Boolean(result?.found);
  }

  async insert(ctx: WebAdapterContext, text: string): Promise<void> {
    const selectors = this.getSelectors();
    const result = await withTimeout<SetInputResult>(
      execDomScript<SetInputResult>(ctx.tabId, domScriptTemplates.setInputValue, [
        selectors.input,
        selectorHeuristics.defaults.input,
        text
      ]),
      this.config.timeoutsMs?.insert ?? 4000,
      "TIMEOUT",
      "Insert prompt timed out"
    );
    if (!result?.ok) {
      throw new AdapterError(result?.reason === "NOT_FOUND" ? "NO_INPUT" : "DOM_CHANGED", "Failed to insert prompt");
    }
  }

  async send(ctx: WebAdapterContext): Promise<void> {
    const selectors = this.getSelectors();
    const attemptButton = await execDomScript<ClickResult>(ctx.tabId, domScriptTemplates.clickFirst, [
      selectors.sendButton || []
    ]);
    if (attemptButton?.ok) {
      return;
    }

    if (this.config.capabilities?.supportsEnterToSend) {
      const enterResult = await execDomScript<ClickResult>(ctx.tabId, pressEnterScript, [
        selectors.input,
        selectorHeuristics.defaults.input
      ]);
      if (enterResult?.ok) {
        return;
      }
    }

    throw new AdapterError("NOT_READY", "Send control not found");
  }

  async readLastAnswer(ctx: WebAdapterContext): Promise<string> {
    const selectors = this.getSelectors();
    const result = await withTimeout<AssistantMessageResult>(
      execDomScript<AssistantMessageResult>(
        ctx.tabId,
        domScriptTemplates.findLastAssistantMessage,
        [
          selectors.messages || selectorHeuristics.defaults.messages,
          selectors.assistantMessage || selectorHeuristics.defaults.assistantMessage
        ]
      ),
      this.config.timeoutsMs?.read ?? 6000,
      "TIMEOUT",
      "Reading assistant reply timed out"
    );
    if (!result?.ok || !result.text) {
      throw new AdapterError("NOT_READY", "Assistant response not available");
    }
    return result.text;
  }

  async exportHistory(ctx: WebAdapterContext, limit: number): Promise<Array<{ role: "user" | "assistant"; text: string; ts?: string }>> {
    if (!this.config.capabilities?.canExportHistory) {
      throw new AdapterError("NOT_SUPPORTED", "History export not supported");
    }
    const selectors = this.getSelectors();
    const history = await execDomScript<
      Array<{ role: "user" | "assistant"; text: string; ts?: string }>
    >(ctx.tabId, domScriptTemplates.extractThread, [
      selectors.messages || selectorHeuristics.defaults.messages,
      selectors.assistantMessage || selectorHeuristics.defaults.assistantMessage,
      selectors.userMessage || selectorHeuristics.defaults.userMessage,
      limit
    ]);
    return history || [];
  }

  async healthCheck(ctx: WebAdapterContext): Promise<{ ok: boolean; details?: string }> {
    const inputReady = await this.ready(ctx).catch((error: Error) => {
      return { ok: false, details: error.message };
    });
    if (typeof inputReady !== "boolean") {
      return inputReady;
    }
    if (!inputReady) {
      return { ok: false, details: "Input control not found" };
    }

    try {
      await this.readLastAnswer(ctx);
    } catch (error) {
      return {
        ok: false,
        details: error instanceof Error ? error.message : String(error)
      };
    }

    return { ok: true };
  }
}

export const chatGptAdapter = new ChatGptAdapter();
