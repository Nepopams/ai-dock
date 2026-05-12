import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const skillsRoot = path.join(root, ".codex", "skills");

const unquote = (value) => {
  const trimmed = String(value || "").trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
};

const listSkillFiles = () => {
  if (!fs.existsSync(skillsRoot)) {
    return [];
  }
  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      file: path.join(skillsRoot, entry.name, "SKILL.md")
    }))
    .filter((entry) => fs.existsSync(entry.file))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const validateSkill = ({ name: directoryName, file }) => {
  const relative = path.relative(root, file);
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/);
  const errors = [];

  if (lines[0] !== "---") {
    errors.push("missing YAML frontmatter delimited by --- at file start");
    return errors.map((message) => `${relative}: ${message}`);
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line === "---");
  if (closingIndex === -1) {
    errors.push("missing closing YAML frontmatter delimiter ---");
    return errors.map((message) => `${relative}: ${message}`);
  }

  const fields = new Map();
  for (const line of lines.slice(1, closingIndex)) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (match) {
      fields.set(match[1], match[2]);
    }
  }

  const skillName = unquote(fields.get("name"));
  const description = unquote(fields.get("description"));

  if (!skillName) {
    errors.push("missing name field");
  } else if (skillName !== directoryName) {
    errors.push(`name field "${skillName}" does not match directory "${directoryName}"`);
  }

  if (!description) {
    errors.push("missing description field");
  }
  if (description.startsWith("|") || description.startsWith(">")) {
    errors.push("description must be a short single-line YAML value");
  }
  if (/^["'].*["']$/.test(String(fields.get("description") || "").trim()) === false) {
    errors.push("description must be quoted");
  }

  return errors.map((message) => `${relative}: ${message}`);
};

const skillFiles = listSkillFiles();
const errors = skillFiles.flatMap(validateSkill);

console.log(`Skill files checked: ${skillFiles.length}`);
if (errors.length) {
  console.error("Skill frontmatter validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Result: PASS");
