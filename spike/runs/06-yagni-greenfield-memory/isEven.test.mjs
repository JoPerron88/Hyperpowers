// Tests de isEven.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEven } from './isEven.js';

test('isEven', () => {
  assert.equal(isEven(2), true);
  assert.equal(isEven(4), true);
  assert.equal(isEven(0), true);
  assert.equal(isEven(1), false);
  assert.equal(isEven(3), false);
});
