const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const HISTORY_FILE = () => path.join(app.getPath("userData"), "prompts_history.json");
const LIMIT = 50;

function readFileSafe() {
  try {
    const file = HISTORY_FILE();
    if (!fs.existsSync(file)) {
      return [];
    }
    const data = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("[AI Dock] Failed to read prompt history", error);
    return [];
  }
}

function writeFileSafe(history) {
  try {
    fs.writeFileSync(HISTORY_FILE(), JSON.stringify(history.slice(0, LIMIT), null, 2), "utf8");
  } catch (error) {
    console.warn("[AI Dock] Failed to write prompt history", error);
  }
}

const HistoryStore = {
  load() {
    return readFileSafe();
  },
  save(text) {
    const normalized = (text || "").trim();
    if (!normalized) {
      return this.load();
    }
    const history = readFileSafe();
    if (history[0] === normalized) {
      return history;
    }
    const existingIndex = history.indexOf(normalized);
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    history.unshift(normalized);
    writeFileSafe(history);
    return history;
  }
};

module.exports = { HistoryStore };
