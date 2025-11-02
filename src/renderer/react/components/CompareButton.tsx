import { useMemo } from "react";
import { ChatMessage } from "../store/chatSlice";
import { useDockStore } from "../store/useDockStore";

interface CompareButtonProps {
  messages: ChatMessage[];
  defaultJudgeProfile?: string | null;
}

const normalizeAgentId = (message: ChatMessage, index: number): string => {
  const metadata = message.metadata?.requestOptions || {};
  const fields = [metadata.profile, metadata.model, metadata.provider];
  for (const field of fields) {
    if (typeof field === "string" && field.trim()) {
      return field.trim();
    }
  }
  return `assistant_${index + 1}`;
};

const buildComparisonPayload = (
  messages: ChatMessage[],
  defaultJudgeProfile?: string | null
) => {
  if (!Array.isArray(messages) || !messages.length) {
    return null;
  }
  let lastUserIndex = -1;
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      lastUserIndex = index;
      break;
    }
  }
  if (lastUserIndex === -1) {
    return null;
  }
  const question = messages[lastUserIndex]?.content || "";
  const answers: Array<{ agentId: string; text: string; id: string }> = [];
  for (let index = lastUserIndex + 1; index < messages.length; index += 1) {
    const message = messages[index];
    if (!message) {
      continue;
    }
    if (message.role === "user") {
      break;
    }
    if (message.role === "assistant") {
      const text = message.content || "";
      if (!text.trim()) {
        continue;
      }
      answers.push({
        agentId: normalizeAgentId(message, answers.length),
        text,
        id: message.id
      });
    }
  }
  if (answers.length < 2) {
    return null;
  }
  return {
    question,
    answers,
    judgeProfileId:
      typeof defaultJudgeProfile === "string" && defaultJudgeProfile.trim()
        ? defaultJudgeProfile.trim()
        : undefined
  };
};

function CompareButton({ messages, defaultJudgeProfile }: CompareButtonProps) {
  const prepareJudgeComparison = useDockStore((state) => state.actions.prepareJudgeComparison);
  const showToast = useDockStore((state) => state.actions.showToast);

  const payload = useMemo(
    () => buildComparisonPayload(messages, defaultJudgeProfile),
    [messages, defaultJudgeProfile]
  );

  const handleClick = async () => {
    if (!payload) {
      showToast("Need at least two assistant answers after the latest question");
      return;
    }
    await prepareJudgeComparison(payload);
  };

  const disabled = !payload;

  return (
    <button
      type="button"
      className="pill-btn ghost"
      onClick={handleClick}
      disabled={disabled}
      title={disabled ? "Provide at least two assistant responses to compare" : "Compare answers"}
    >
      Compare
    </button>
  );
}

export default CompareButton;
