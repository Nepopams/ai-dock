const fs = require("fs");
const path = require("path");
const os = require("os");

const userDataDir = (() => {
  try {
    const electron = require("electron");
    return electron.app ? electron.app.getPath("userData") : path.join(os.homedir(), ".ai-dock");
  } catch (err) {
    return path.join(os.homedir(), ".ai-dock");
  }
})();

function resolvePath(name) {
  return path.join(userDataDir, `${name}.json`);
}

function ensureDir() {
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }
}

function getState(name, defaultValue) {
  ensureDir();
  const file = resolvePath(name);
  try {
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, "utf8"));
      return data;
    }
  } catch (error) {
    console.error(`Failed to read state ${name}`, error);
  }
  return defaultValue;
}

function setState(name, value) {
  ensureDir();
  const file = resolvePath(name);
  try {
    fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf8");
  } catch (error) {
    console.error(`Failed to write state ${name}`, error);
  }
}

module.exports = {
  getState,
  setState
};
