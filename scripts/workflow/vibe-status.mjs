#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const workpacksRoot = path.join(root, 'docs', 'planning', 'workpacks');

if (!fs.existsSync(workpacksRoot)) {
  console.error('FAIL: docs/planning/workpacks not found');
  process.exit(1);
}

const entries = fs.readdirSync(workpacksRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== '_template')
  .map((d) => d.name)
  .sort();

if (!entries.length) {
  console.log('No workpacks found.');
  process.exit(0);
}

console.log('Workpack status report');
console.log('======================');

for (const name of entries) {
  const base = path.join(workpacksRoot, name);
  const wp = path.join(base, 'workpack.md');
  const pp = path.join(base, 'prompt-plan.md');
  const pa = path.join(base, 'prompt-apply.md');
  const pr = path.join(base, 'prompt-review.md');

  let status = 'unknown';
  if (fs.existsSync(wp)) {
    const text = fs.readFileSync(wp, 'utf8');
    const m = text.match(/## Status\s*\n([^\n]+)/m);
    if (m && m[1]) status = m[1].trim();
  }

  console.log(`- ${name}`);
  console.log(`  status: ${status}`);
  console.log(`  workpack.md: ${fs.existsSync(wp) ? 'yes' : 'no'}`);
  console.log(`  prompt-plan.md: ${fs.existsSync(pp) ? 'yes' : 'no'}`);
  console.log(`  prompt-apply.md: ${fs.existsSync(pa) ? 'yes' : 'no'}`);
  console.log(`  prompt-review.md: ${fs.existsSync(pr) ? 'yes' : 'no'}`);
}
