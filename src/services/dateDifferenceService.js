import moment from 'moment';
import {
  hijriToGregorian
} from './hijriService';

export function parseDateInput(
  value
) {
  if (
    value.calendar ===
    'hijri'
  ) {
    return hijriToGregorian({
      year:
        Number(
          value.year
        ),
      month:
        Number(
          value.month
        ),
      day:
        Number(
          value.day
        )
    });
  }

  return moment({
    year:
      Number(
        value.year
      ),
    month:
      Number(
        value.month
      ) - 1,
    day:
      Number(
        value.day
      )
  });
}

export function calculateDateDifference(
  first,
  second
) {
  const a =
    parseDateInput(
      first
    ).startOf('day');

  const b =
    parseDateInput(
      second
    ).startOf('day');

  if (
    !a.isValid() ||
    !b.isValid()
  ) {
    return null;
  }

  const start =
    moment.min(
      a,
      b
    );

  const end =
    moment.max(
      a,
      b
    );

  const totalDays =
    end.diff(
      start,
      'days'
    );

  const years =
    end.diff(
      start,
      'years'
    );

  const afterYears =
    start
      .clone()
      .add(
        years,
        'years'
      );

  const months =
    end.diff(
      afterYears,
      'months'
    );

  const afterMonths =
    afterYears
      .clone()
      .add(
        months,
        'months'
      );

  const days =
    end.diff(
      afterMonths,
      'days'
    );

  return {
    totalDays,
    years,
    months,
    days,
    direction:
      a.isAfter(b)
        ? 'reverse'
        : 'forward'
  };
}
