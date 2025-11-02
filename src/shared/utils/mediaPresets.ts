import type { MediaPreset } from "../types/mediaPresets";

const stringifyExtras = (extras: Record<string, unknown> | undefined): string | undefined => {
  if (!extras || typeof extras !== "object" || Array.isArray(extras)) {
    return undefined;
  }
  try {
    return JSON.stringify(extras);
  } catch {
    return undefined;
  }
};

export const composeMediaPresetText = (preset: MediaPreset): string => {
  const segments: string[] = [];
  const prompt = preset.prompt.trim();
  if (prompt) {
    segments.push(prompt);
  }
  if (preset.negativePrompt && preset.negativePrompt.trim()) {
    segments.push(`NEGATIVE: ${preset.negativePrompt.trim()}`);
  }
  if (preset.params) {
    const parts: string[] = [];
    if (preset.params.aspect && String(preset.params.aspect).trim()) {
      parts.push(`aspect=${String(preset.params.aspect).trim()}`);
    }
    if (preset.params.steps !== undefined) {
      parts.push(`steps=${preset.params.steps}`);
    }
    if (preset.params.guidance !== undefined) {
      parts.push(`guidance=${preset.params.guidance}`);
    }
    if (preset.params.seed !== undefined && String(preset.params.seed).trim()) {
      parts.push(`seed=${String(preset.params.seed).trim()}`);
    }
    const extras = stringifyExtras(preset.params.extras);
    if (extras) {
      parts.push(`extras=${extras}`);
    }
    if (parts.length) {
      segments.push(`PARAMS: ${parts.join(", ")}`);
    }
  }
  return segments.join("\n\n");
};
