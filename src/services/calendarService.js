import moment from 'moment';

export function getGregorianDays(
  year,
  month,
  weekStartsOn = 6,
  includeLeadingGaps = true
) {
  const firstDay =
    moment({
      year,
      month,
      day: 1
    });

  const daysInMonth =
    firstDay.daysInMonth();

  const firstWeekday =
    firstDay.day();

  const offset =
    (
      firstWeekday -
      weekStartsOn +
      7
    ) % 7;

  const days = [];

  if (
    includeLeadingGaps
  ) {
    for (
      let i = 0;
      i < offset;
      i += 1
    ) {
      days.push(null);
    }
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    days.push(
      moment({
        year,
        month,
        day
      })
    );
  }

  return days;
}

export function getToday() {
  return moment();
}

export function isSameGregorianDate(
  dateA,
  dateB
) {
  if (
    !dateA ||
    !dateB
  ) {
    return false;
  }

  return dateA.isSame(
    dateB,
    'day'
  );
}
