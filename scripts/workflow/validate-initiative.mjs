#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const requiredFiles = new Map([
  ['initiative.md', [
    '## Initiative ID',
    '## Title',
    '## Status',
    '## Owner',
    '## Goal',
    '## User value',
    '## Problem',
    '## Success criteria',
    '## In scope',
    '## Out of scope',
    '## Constraints',
    '## Strong human gate triggers',
    '## Candidate epics',
    '## Risks',
    '## Links'
  ]],
  ['orchestration-plan.md', [
    '## Initiative summary',
    '## Assumptions',
    '## Selected delivery mode',
    '## Epic breakdown',
    '## Sprint mapping',
    '## Workpack queue',
    '## Executor routing',
    '## Gate plan',
    '## Verification strategy',
    '## Risk register'
  ]],
  ['task-queue.md', [
    '## Queue status',
    '## Workpack ID',
    '## Type',
    '## Selected executor',
    '## Status',
    '## Gate status',
    '## PLAN status',
    '## APPLY status',
    '## REVIEW status',
    '## Next action'
  ]],
  ['run-state.md', [
    '## Current phase',
    '## Last completed step',
    '## Current workpack',
    '## Blockers',
    '## Strong gates pending',
    '## Commands run',
    '## Review verdicts',
    '## Next action'
  ]],
  ['gates.md', [
    '## Soft gates',
    '## Strong human gates',
    '## Stop-the-line events',
    '## Approval log',
    '## Decisions log'
  ]],
  ['delivery-report.md', [
    '## Summary',
    '## Workpacks completed',
    '## Files changed',
    '## Commands run',
    '## Test results',
    '## Review results',
    '## Risks',
    '## Follow-ups',
    '## Merge recommendation'
  ]]
]);

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: node scripts/workflow/validate-initiative.mjs <path-to-initiative-dir>');
  process.exit(2);
}

const resolvedPath = path.resolve(process.cwd(), inputPath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`FAIL: directory not found: ${resolvedPath}`);
  process.exit(2);
}

const stat = fs.statSync(resolvedPath);

if (!stat.isDirectory()) {
  console.error(`FAIL: expected directory: ${resolvedPath}`);
  process.exit(2);
}

const failures = [];

for (const [fileName, sections] of requiredFiles.entries()) {
  const filePath = path.join(resolvedPath, fileName);

  if (!fs.existsSync(filePath)) {
    failures.push(`${fileName}: missing file`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const missingSections = sections.filter((section) => !content.includes(section));

  for (const section of missingSections) {
    failures.push(`${fileName}: missing section ${section}`);
  }
}

console.log(`Initiative directory: ${inputPath}`);
console.log(`Required files: ${requiredFiles.size}`);

if (failures.length) {
  console.log('Result: FAIL');
  console.log('Issues:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Result: PASS');
process.exit(0);
