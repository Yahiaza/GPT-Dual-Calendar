import test from 'node:test';
import assert from 'node:assert/strict';
import gregorianMoment from 'moment';
import hijriMoment from 'moment-hijri';
import { createReminder, generateReminderOccurrences, getRemindersForDate } from './reminderService.js';

const moment = value => hijriMoment(gregorianMoment(value).toDate());

test('monthly Hijri reminders stay on day 1 and appear on the equivalent Gregorian dates', () => {
  const reminder = createReminder({
    title: 'أول الشهر', date: '2026-10-12',
    recurrenceType: 'monthly', recurrenceCalendar: 'hijri'
  });
  const occurrences = generateReminderOccurrences(reminder, { maxOccurrences: 3 });
  assert.equal(reminder.recurrence.calendar, 'hijri');
  assert.deepEqual(occurrences.slice(0, 2).map(item => moment(item.date).locale('en').format('YYYY-MM-DD')), ['2026-10-12', '2026-11-11']);
  assert.deepEqual(occurrences.map(item => moment(item.date).iDate()), [1, 1, 1]);
  assert.equal(getRemindersForDate([reminder], '2026-11-11', []).length, 1);
  assert.equal(getRemindersForDate([reminder], '2026-11-12', []).length, 0);
});

test('old reminders without calendar metadata retain Gregorian monthly recurrence', () => {
  const reminder = { id: 'old', title: 'قديم', date: '2026-10-12', time: '09:00', recurrence: { type: 'monthly', interval: 1 } };
  assert.deepEqual(generateReminderOccurrences(reminder, { maxOccurrences: 2 }).map(item => moment(item.date).locale('en').format('YYYY-MM-DD')), ['2026-10-12', '2026-11-12']);
});

test('Hijri monthly recurrence respects interval, count, and stored date adjustment', () => {
  const reminder = createReminder({
    title: 'هجري مضبوط', date: '2026-10-11', recurrenceType: 'monthly',
    recurrenceCalendar: 'hijri', hijriAdjustment: 1,
    recurrenceInterval: 2, recurrenceEndType: 'count', recurrenceCount: 3
  });
  const occurrences = generateReminderOccurrences(reminder);
  assert.equal(occurrences.length, 3);
  assert.deepEqual(occurrences.map(item => {
    const date = moment(item.date).add(1, 'day');
    return [date.iMonth() + 1, date.iDate()];
  }), [[5, 1], [7, 1], [9, 1]]);
});

test('day 30 uses the last day of a short Hijri month and returns to day 30 afterwards', () => {
  const reminder = createReminder({
    title: 'نهاية الشهر', date: '2026-11-10', recurrenceType: 'monthly', recurrenceCalendar: 'hijri'
  });
  const occurrences = generateReminderOccurrences(reminder, { maxOccurrences: 3 });
  assert.deepEqual(occurrences.map(item => {
    const date = moment(item.date);
    return [date.iMonth() + 1, date.iDate()];
  }), [[5, 30], [6, 29], [7, 30]]);
});

test('yearly Hijri reminders keep the Hijri month and day and respect the end date', () => {
  const reminder = createReminder({
    title: 'سنوي', date: '2026-10-12', recurrenceType: 'yearly', recurrenceCalendar: 'hijri',
    recurrenceEndType: 'date', recurrenceEndDate: '2027-12-31'
  });
  const occurrences = generateReminderOccurrences(reminder);
  assert.deepEqual(occurrences.map(item => {
    const date = moment(item.date);
    return [date.iYear(), date.iMonth() + 1, date.iDate()];
  }), [[1448, 5, 1], [1449, 5, 1]]);
});

test('saved Hijri reminders preserve recurrence and per-occurrence deletion', () => {
  const reminder = JSON.parse(JSON.stringify(createReminder({
    title: 'محفوظ', date: '2026-10-12', recurrenceType: 'monthly', recurrenceCalendar: 'hijri'
  })));
  const november = getRemindersForDate([reminder], '2026-11-11', [])[0];
  assert.ok(november);
  assert.equal(getRemindersForDate([reminder], '2026-11-11', [november.occurrenceId]).length, 0);
  assert.equal(getRemindersForDate([reminder], '2026-12-10', [november.occurrenceId]).length, 1);
});
