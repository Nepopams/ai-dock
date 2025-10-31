import {
  AdapterConfig,
  AdapterError,
  AdapterSelectors,
  IAgentAdapter,
  WebAdapterContext
} from "../IAgentAdapter";
import { buildAdapterSelectors, selectorHeuristics } from "../selectorHeuristics.ts";
import { domScriptTemplates, toDomScriptSource } from "../../utils/domScriptTemplates";
import { execDomScript, withTimeout } from "../adapterBridgeClient";

const pressEnterScript = toDomScriptSource(function pressEnterDom(
  selectors: string[],
  fallbackSelectors: string[]
) {
  const unique = (items: string[] = []) => {
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

  const list = unique([...(selectors || []), ...(fallbackSelectors || [])]);
  for (const selector of list) {
    const node = document.querySelector(selector) as HTMLElement | null;
    if (!node) {
      continue;
    }
    const down = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true
    });
    const up = new KeyboardEvent("keyup", {
      key: "Enter",
      code: "Enter",
      bubbles: true
    });
    node.dispatchEvent(down);
    node.dispatchEvent(up);
    return { ok: true, selector };
  }
  return { ok: false };
});

const claudeBaseSelectors: AdapterSelectors = {
  input: [
    "textarea[placeholder*='Message Claude']",
    "textarea[data-testid='composer-textarea']",
    "textarea[aria-label*='message']",
    "[data-testid='composer'] textarea"
  ],
  sendButton: [
    "button[data-testid='composer-send-button']",
    "button[aria-label*='Send']",
    "button:has(svg[data-testid*='send'])"
  ],
  messages: [
    "[data-testid='message-list']",
    "main div[class*='Conversation']",
    "main div:has([data-testid='message-card'])"
  ],
  assistantMessage: [
    "[data-testid='message-card-assistant']",
    "[data-role='assistant']",
    ".message-group.assistant"
  ],
  userMessage: [
    "[data-testid='message-card-user']",
    "[data-role='user']",
    ".message-group.user"
  ]
};

const defaultConfig: AdapterConfig = {
  selectors: buildAdapterSelectors(claudeBaseSelectors),
  capabilities: {
    supportsEnterToSend: true,
    canExportHistory: true
  },
  timeoutsMs: {
    ready: 6000,
    insert: 4000,
    send: 4000,
    read: 6000
  }
};

type FindInputResult = {
  found: boolean;
};

type SetInputResult = {
  ok: boolean;
  reason?: string;
};

type ClickResult = {
  ok: boolean;
};

type AssistantMessageResult = {
  ok: boolean;
  text?: string;
};

export class ClaudeAdapter implements IAgentAdapter {
  public readonly id = "claude";
  public config: AdapterConfig;
  private readonly baseSelectors: AdapterSelectors;

  constructor(baseConfig: AdapterConfig = defaultConfig) {
    this.config = baseConfig;
    this.baseSelectors = claudeBaseSelectors;
  }

  updateSelectors(overrides?: Partial<AdapterSelectors>): void {
    const merged: Partial<AdapterSelectors> = {
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
      selectors: buildAdapterSelectors(merged)
    };
  }

  private selectors(): AdapterSelectors {
    return this.config.selectors;
  }

  async ready(ctx: WebAdapterContext): Promise<boolean> {
    const result = await withTimeout<FindInputResult>(
      execDomScript<FindInputResult>(ctx.tabId, domScriptTemplates.findInput, [
        this.selectors().input,
        selectorHeuristics.defaults.input
      ]),
      this.config.timeoutsMs?.ready ?? 6000,
      "TIMEOUT",
      "Claude input not ready"
    );
    return Boolean(result?.found);
  }

  async insert(ctx: WebAdapterContext, text: string): Promise<void> {
    const setResult = await withTimeout<SetInputResult>(
      execDomScript<SetInputResult>(ctx.tabId, domScriptTemplates.setInputValue, [
        this.selectors().input,
        selectorHeuristics.defaults.input,
        text
      ]),
      this.config.timeoutsMs?.insert ?? 4000,
      "TIMEOUT",
      "Claude insert timed out"
    );
    if (!setResult?.ok) {
      throw new AdapterError(setResult?.reason === "NOT_FOUND" ? "NO_INPUT" : "DOM_CHANGED", "Unable to insert prompt");
    }
  }

  async send(ctx: WebAdapterContext): Promise<void> {
    const selectors = this.selectors();
    const clickResult = await execDomScript<ClickResult>(ctx.tabId, domScriptTemplates.clickFirst, [
      selectors.sendButton || []
    ]);
    if (clickResult?.ok) {
      return;
    }

    if (this.config.capabilities?.supportsEnterToSend) {
      const enter = await execDomScript<ClickResult>(ctx.tabId, pressEnterScript, [
        selectors.input,
        selectorHeuristics.defaults.input
      ]);
      if (enter?.ok) {
        return;
      }
    }

    throw new AdapterError("NOT_READY", "Send button not found for Claude");
  }

  async readLastAnswer(ctx: WebAdapterContext): Promise<string> {
    const selectors = this.selectors();
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
      "Reading Claude response timed out"
    );
    if (!result?.ok || !result.text) {
      throw new AdapterError("NOT_READY", "Claude response not available");
    }
    return result.text;
  }

  async exportHistory(
    ctx: WebAdapterContext,
    limit: number
  ): Promise<Array<{ role: "user" | "assistant"; text: string; ts?: string }>> {
    if (!this.config.capabilities?.canExportHistory) {
      throw new AdapterError("NOT_SUPPORTED", "History export not supported by Claude adapter");
    }
    const selectors = this.selectors();
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
    const ready = await this.ready(ctx).catch((error: Error) => ({
      ok: false,
      details: error.message
    }));
    if (typeof ready !== "boolean") {
      return ready;
    }
    if (!ready) {
      return { ok: false, details: "Composer input not detected" };
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

export const claudeAdapter = new ClaudeAdapter();

