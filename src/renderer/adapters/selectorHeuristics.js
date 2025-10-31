const visibleTextInputs = [
  "textarea:not([disabled])",
  "textarea[contenteditable='false']",
  "div[contenteditable='true']",
  "[role='textbox']",
  "input[type='text']:not([disabled])",
  "[data-testid*='prompt']:not([disabled])",
  "[data-qa='chat-input']"
];

const sendButtonSelectors = [
  "button[data-testid*='send']",
  "button[type='submit']",
  "button[aria-label*='Send']",
  "button:has(svg[data-testid*='send'])",
  "[data-testid='send-button']"
];

const messageListSelectors = [
  "[data-testid='chat-messages']",
  "[role='log']",
  "[role='list'] .items-center",
  "main section div:has(article)",
  ".conversation-content",
  ".chat-content"
];

const assistantMessageSelectors = [
  "[data-role='assistant-message']",
  "[data-message-author-role='assistant']",
  "[data-testid='assistant-message']",
  ".assistant",
  ".message.bot",
  ".msg.role-assistant"
];

const userMessageSelectors = [
  "[data-role='user-message']",
  "[data-message-author-role='user']",
  "[data-testid='user-message']",
  ".user",
  ".message.user",
  ".msg.role-user"
];

const uniq = (items) => {
  const seen = new Set();
  const result = [];
  items.forEach((item) => {
    const trimmed = (item || "").trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  });
  return result;
};

const mergeSelectors = (overrides, defaults) => {
  const base = Array.isArray(overrides) ? overrides : [];
  return uniq([...base, ...defaults]);
};

const buildAdapterSelectors = (overrides = {}) => ({
  input: mergeSelectors(overrides.input, visibleTextInputs),
  sendButton: mergeSelectors(overrides.sendButton, sendButtonSelectors),
  messages: mergeSelectors(overrides.messages, messageListSelectors),
  assistantMessage: mergeSelectors(overrides.assistantMessage, assistantMessageSelectors),
  userMessage: mergeSelectors(overrides.userMessage, userMessageSelectors)
});

const selectorHeuristics = {
  defaults: {
    input: [...visibleTextInputs],
    sendButton: [...sendButtonSelectors],
    messages: [...messageListSelectors],
    assistantMessage: [...assistantMessageSelectors],
    userMessage: [...userMessageSelectors]
  },
  mergeSelectors,
  uniq
};

module.exports = {
  buildAdapterSelectors,
  selectorHeuristics
};
