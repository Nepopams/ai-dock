#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const requiredSections = [
  '## Workpack ID',
  '## Title',
  '## Status',
  '## Owner',
  '## Mode',
  '## Sources of truth',
  '## Goal',
  '## User value',
  '## In scope',
  '## Out of scope',
  '## Current architecture context',
  '## Allowed files',
  '## Forbidden files',
  '## Step-by-step plan',
  '## Acceptance criteria',
  '## Test plan',
  '## Security impact',
  '## IPC impact',
  '## Docs impact',
  '## Rollback',
  '## Done criteria',
  '## Risks',
  '## Prompt pack links'
];

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/workflow/validate-workpack.mjs <path-to-workpack.md>');
  process.exit(2);
}

const resolvedPath = path.resolve(process.cwd(), inputPath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`FAIL: file not found: ${resolvedPath}`);
  process.exit(2);
}

const content = fs.readFileSync(resolvedPath, 'utf8');
const missing = requiredSections.filter((section) => !content.includes(section));

console.log(`Workpack: ${inputPath}`);
console.log(`Required sections: ${requiredSections.length}`);

if (missing.length) {
  console.log('Result: FAIL');
  console.log('Missing sections:');
  for (const section of missing) {
    console.log(`- ${section}`);
  }
  process.exit(1);
}

console.log('Result: PASS');
process.exit(0);
