import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGregorianDays
} from './calendarService.js';

import * as calendarService from './calendarService.js';

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

test('Gregorian calendar title includes its zero-padded month number and era', () => {
  const formatTitle =
    calendarService
      .formatCalendarMonthTitle;

  assert.equal(
    typeof formatTitle,
    'function'
  );
  assert.equal(
    formatTitle({
      monthName: 'أكتوبر',
      monthNumber: 10,
      year: 2026,
      era: 'م'
    }),
    'أكتوبر [10] 2026 م'
  );
});

test('Hijri calendar title pads a single-digit month number', () => {
  const formatTitle =
    calendarService
      .formatCalendarMonthTitle;

  assert.equal(
    typeof formatTitle,
    'function'
  );
  assert.equal(
    formatTitle({
      monthName:
        'جمادى الأولى',
      monthNumber: 5,
      year: 1448,
      era: 'هـ'
    }),
    'جمادى الأولى [05] 1448 هـ'
  );
});
