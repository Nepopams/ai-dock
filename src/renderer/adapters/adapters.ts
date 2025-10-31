
import { AdapterId, AdapterSelectors, AdapterError, IAgentAdapter } from "./IAgentAdapter";
import { chatGptAdapter, ChatGptAdapter } from "./impl/chatgpt.adapter";
import { claudeAdapter, ClaudeAdapter } from "./impl/claude.adapter";
import { deepSeekAdapter, DeepSeekAdapter } from "./impl/deepseek.adapter";

type MutableAdapter = IAgentAdapter & {
  updateSelectors?: (overrides?: Partial<AdapterSelectors>) => void;
};

export const resolveAdapterId = (raw?: string | null): AdapterId | null => {
  if (!raw) {
    return null;
  }
  const normalized = raw.split(".").pop()?.trim().toLowerCase();
  switch (normalized) {
    case "chatgpt":
    case "claude":
    case "deepseek":
      return normalized as AdapterId;
    default:
      return null;
  }
};

const adapterMap: Record<AdapterId, MutableAdapter> = {
  chatgpt: chatGptAdapter,
  claude: claudeAdapter,
  deepseek: deepSeekAdapter
};

export const getAdapterById = (adapterId: AdapterId): IAgentAdapter => {
  const adapter = adapterMap[adapterId];
  if (!adapter) {
    throw new AdapterError("UNKNOWN", `Adapter ${adapterId} is not registered`);
  }
  return adapter;
};

export const updateAdapterOverrides = (
  adapterId: AdapterId,
  overrides?: Partial<AdapterSelectors>
): void => {
  const adapter = adapterMap[adapterId];
  if (adapter && typeof adapter.updateSelectors === "function") {
    adapter.updateSelectors(overrides);
  }
};

export const adapters = {
  chatgpt: chatGptAdapter,
  claude: claudeAdapter,
  deepseek: deepSeekAdapter
};

export type AdapterRegistry = typeof adapters;

