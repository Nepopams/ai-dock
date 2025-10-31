/* eslint-disable @typescript-eslint/no-explicit-any */
function findInputDom(selectors: string[], fallbackSelectors: string[]) {
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

  const isVisible = (node: any) => {
    if (!node) {
      return false;
    }
    const style = window.getComputedStyle(node);
    if (!style || style.visibility === "hidden" || style.display === "none") {
      return false;
    }
    const rect = node.getBoundingClientRect();
    return rect && rect.width > 1 && rect.height > 1;
  };

  const pick = (nodes: NodeListOf<HTMLElement>): HTMLElement | null => {
    for (const node of Array.from(nodes)) {
      if (node instanceof HTMLElement && isVisible(node)) {
        return node;
      }
    }
    return null;
  };

  for (const selector of list) {
    const nodes = document.querySelectorAll(selector);
    if (!nodes || nodes.length === 0) {
      continue;
    }
    const found = pick(nodes as NodeListOf<HTMLElement>);
    if (found) {
      return {
        found: true,
        selector,
        tagName: found.tagName,
        isContentEditable: found.isContentEditable === true
      };
    }
  }

  return { found: false };
}

function setInputValueDom(selectors: string[], fallbackSelectors: string[], value: string) {
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

  const isVisible = (node: any) => {
    if (!node) {
      return false;
    }
    const style = window.getComputedStyle(node);
    if (!style || style.visibility === "hidden" || style.display === "none") {
      return false;
    }
    const rect = node.getBoundingClientRect();
    return rect && rect.width > 1 && rect.height > 1;
  };

  let target: HTMLElement | null = null;
  let selectorUsed: string | null = null;

  for (const selector of list) {
    const nodes = document.querySelectorAll(selector);
    if (!nodes || nodes.length === 0) {
      continue;
    }
    for (const node of Array.from(nodes)) {
      if (node instanceof HTMLElement && isVisible(node)) {
        target = node;
        selectorUsed = selector;
        break;
      }
    }
    if (target) {
      break;
    }
  }

  if (!target || !selectorUsed) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  const text = String(value ?? "");

  if ((target as HTMLTextAreaElement).value !== undefined) {
    const input = target as HTMLTextAreaElement;
    input.focus();
    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return { ok: true, selector: selectorUsed };
  }

  if (target.isContentEditable) {
    target.focus();
    target.innerText = text;
    target.dispatchEvent(new Event("input", { bubbles: true }));
    return { ok: true, selector: selectorUsed };
  }

  return { ok: false, reason: "UNSUPPORTED_NODE" };
}

function clickFirstDom(selectors: string[]) {
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

  const list = unique(selectors);
  for (const selector of list) {
    const node = document.querySelector(selector) as HTMLElement | null;
    if (!node) {
      continue;
    }
    const rect = node.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
      continue;
    }
    node.click();
    return { ok: true, selector };
  }
  return { ok: false };
}

function findLastAssistantMessageDom(messageSelectors: string[], assistantSelectors: string[]) {
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

  const normalize = (value: string | null | undefined) =>
    (value || "").replace(/\s+/g, " ").trim();

  const candidates = unique(messageSelectors);
  const assistant = unique(assistantSelectors);

  const collectMessages = (): HTMLElement[] => {
    const aggregated: HTMLElement[] = [];
    candidates.forEach((selector) => {
      const container = document.querySelector(selector);
      if (!container) {
        return;
      }
      assistant.forEach((assistantSelector) => {
        container.querySelectorAll(assistantSelector).forEach((node) => {
          if (node instanceof HTMLElement) {
            aggregated.push(node);
          }
        });
      });
    });

    if (!aggregated.length) {
      assistant.forEach((assistantSelector) => {
        document.querySelectorAll(assistantSelector).forEach((node) => {
          if (node instanceof HTMLElement) {
            aggregated.push(node);
          }
        });
      });
    }

    return aggregated;
  };

  const items = collectMessages();
  if (!items.length) {
    return { ok: false };
  }

  const node = items[items.length - 1];
  const text = normalize(node.innerText || node.textContent || "");
  if (!text) {
    return { ok: false };
  }
  return { ok: true, text };
}

function extractThreadDom(
  messageSelectors: string[],
  assistantSelectors: string[],
  userSelectors: string[],
  limit: number
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

  const limitValue = typeof limit === "number" && limit > 0 ? limit : 50;
  const messages = unique(messageSelectors);
  const assistant = unique(assistantSelectors);
  const user = unique(userSelectors);
  const normalize = (value: string | null | undefined) =>
    (value || "").replace(/\s+/g, " ").trim();

  const resolveRole = (node: HTMLElement): "user" | "assistant" => {
    const datasetRole =
      (node.dataset && (node.dataset.role || node.dataset.messageAuthorRole)) || "";
    if (typeof datasetRole === "string" && datasetRole.toLowerCase().includes("user")) {
      return "user";
    }
    if (typeof datasetRole === "string" && datasetRole.toLowerCase().includes("assistant")) {
      return "assistant";
    }
    if (assistant.some((selector) => node.matches(selector))) {
      return "assistant";
    }
    if (user.some((selector) => node.matches(selector))) {
      return "user";
    }
    const className = node.className || "";
    if (typeof className === "string") {
      if (className.includes("assistant") || className.includes("bot")) {
        return "assistant";
      }
      if (className.includes("user")) {
        return "user";
      }
    }
    return "assistant";
  };

  const collect = (): Array<{ role: "user" | "assistant"; text: string; ts?: string }> => {
    const output: Array<{ role: "user" | "assistant"; text: string; ts?: string }> = [];
    const containers: HTMLElement[] = [];
    messages.forEach((selector) => {
      const container = document.querySelector(selector);
      if (container instanceof HTMLElement) {
        containers.push(container);
      }
    });

    const source = containers.length
      ? containers
      : [document.body || document.documentElement];

    source.forEach((container) => {
      container.querySelectorAll("*").forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }
        if (
          assistant.some((selector) => node.matches(selector)) ||
          user.some((selector) => node.matches(selector))
        ) {
          const text = normalize(node.innerText || node.textContent || "");
          if (!text) {
            return;
          }
          const ts =
            (node.getAttribute("data-timestamp") ||
              node.getAttribute("data-time") ||
              node.getAttribute("datetime")) || undefined;
          output.push({
            role: resolveRole(node),
            text,
            ts
          });
        }
      });
    });

    return output.slice(-limitValue);
  };

  return collect();
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const toDomScriptSource = (fn: (...args: unknown[]) => unknown): string => fn.toString();

export const domScriptTemplates = {
  findInput: toDomScriptSource(findInputDom),
  setInputValue: toDomScriptSource(setInputValueDom),
  clickFirst: toDomScriptSource(clickFirstDom),
  findLastAssistantMessage: toDomScriptSource(findLastAssistantMessageDom),
  extractThread: toDomScriptSource(extractThreadDom)
};

export type DomScriptName = keyof typeof domScriptTemplates;
