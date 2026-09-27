import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getHijriMonthDays
} from './hijriService.js';

test('Hijri month leaves the weekdays before its first day empty from Saturday', () => {
  const days = getHijriMonthDays(
    1447,
    1
  );

  assert.deepEqual(
    days.slice(0, 5),
    [null, null, null, null, null]
  );
  assert.equal(
    days[5].day,
    1
  );
  assert.deepEqual(
    [
      days[5].gregorian.year(),
      days[5].gregorian.month(),
      days[5].gregorian.date()
    ],
    [2025, 5, 26]
  );
});
