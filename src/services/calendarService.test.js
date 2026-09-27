import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGregorianDays
} from './calendarService.js';

test('Gregorian month leaves Saturday through Tuesday empty when day 1 is Wednesday', () => {
  const days = getGregorianDays(
    2025,
    9
  );

  assert.deepEqual(
    days.slice(0, 4),
    [null, null, null, null]
  );
  assert.deepEqual(
    [
      days[4].year(),
      days[4].month(),
      days[4].date()
    ],
    [2025, 9, 1]
  );
});
