const test = require('node:test');
const assert = require('node:assert/strict');

const { extractVariables, renderTemplate } = require('../src/shared/utils/templateVars.js');

test('extractVariables finds unique names and defaults', () => {
  const body = 'Hello {{name}}! Ticket {{ticketId|N/A}} and {{name}} again. Escaped {{ {{shouldStay}} }}';
  const vars = extractVariables(body);
  assert.deepEqual(vars, [
    { name: 'name', defaultValue: undefined },
    { name: 'ticketId', defaultValue: 'N/A' }
  ]);
});

test('renderTemplate substitutes values and defaults', () => {
  const body = 'Hello {{name}}! Ticket {{ticketId|unknown}}';
  const result = renderTemplate(body, { name: 'Alice' });
  assert.equal(result, 'Hello Alice! Ticket unknown');
});

test('renderTemplate respects provided values', () => {
  const body = 'Hi {{name|friend}}, your code is {{status|good}}';
  const result = renderTemplate(body, { name: 'Bob', status: 'great' });
  assert.equal(result, 'Hi Bob, your code is great');
});

test('renderTemplate keeps escaped braces', () => {
  const body = 'Literal braces: {{ {{notVar}} }}';
  const result = renderTemplate(body, {});
  assert.equal(result, 'Literal braces: {{notVar}}');
});

