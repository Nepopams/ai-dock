import type { JudgeResult } from "../../../../shared/types/judge";

export const PREFERRED_SCORE_CRITERIA = ["coherence", "factuality", "helpfulness"] as const;

const toCriterionId = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
};

export const discoverScoreCriteria = (result: JudgeResult | null | undefined): string[] => {
  const scores = result?.scores;
  if (!scores || typeof scores !== "object" || Array.isArray(scores)) {
    return [];
  }

  const seen = new Set<string>();
  const discovered: string[] = [];

  for (const bucket of Object.values(scores as Record<string, unknown>)) {
    if (!Array.isArray(bucket)) {
      continue;
    }

    for (const score of bucket) {
      if (!score || typeof score !== "object") {
        continue;
      }
      const criterion = toCriterionId((score as { criterion?: unknown }).criterion);
      if (!criterion || seen.has(criterion)) {
        continue;
      }
      seen.add(criterion);
      discovered.push(criterion);
    }
  }

  if (!discovered.length) {
    return [];
  }

  const preferred = PREFERRED_SCORE_CRITERIA.filter((criterion) => seen.has(criterion));
  const preferredSet = new Set<string>(preferred);
  const additional = discovered.filter((criterion) => !preferredSet.has(criterion));

  return [...preferred, ...additional];
};
