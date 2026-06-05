// Tests de isEven.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEven } from './isEven.js';

test('isEven retourne true pour un nombre pair', () => {
  assert.equal(isEven(4), true);
});

test('isEven retourne false pour un nombre impair', () => {
  assert.equal(isEven(3), false);
});
