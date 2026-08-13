import moment from 'moment-hijri';

export const HIJRI_MONTHS = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة'
];

export function getHijriParts(
  date,
  adjustment = 0
) {
  const value =
    moment(date).add(
      adjustment,
      'days'
    );

  const day =
    Number(
      value.format('iD')
    );

  const month =
    Number(
      value.format('iM')
    );

  const year =
    Number(
      value.format('iYYYY')
    );

  return {
    day,
    month,
    year,
    monthName:
      HIJRI_MONTHS[
        month - 1
      ]
  };
}

export function formatHijriDate(
  date,
  adjustment = 0
) {
  const value =
    getHijriParts(
      date,
      adjustment
    );

  return `${value.day} ${value.monthName} ${value.year} هـ`;
}

export function getHijriMonthDays(
  year,
  month,
  adjustment = 0
) {
  const firstHijriDay =
    moment(
      `${year}-${String(
        month
      ).padStart(
        2,
        '0'
      )}-01`,
      'iYYYY-iMM-iDD'
    );

  const daysInMonth =
    firstHijriDay.iDaysInMonth();

  const result = [];

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    const hijriDate =
      firstHijriDay
        .clone()
        .iDate(day);

    const gregorian =
      hijriDate
        .clone()
        .subtract(
          adjustment,
          'days'
        );

    result.push({
      day,
      month,
      year,
      monthName:
        HIJRI_MONTHS[
          month - 1
        ],
      hijriDate:
        hijriDate.clone(),
      gregorian:
        gregorian.clone()
    });
  }

  return result;
}

export function getHijriMonthForDate(
  date,
  adjustment = 0
) {
  const value =
    moment(date).add(
      adjustment,
      'days'
    );

  return {
    year:
      Number(
        value.format(
          'iYYYY'
        )
      ),
    month:
      Number(
        value.format(
          'iM'
        )
      ),
    day:
      Number(
        value.format(
          'iD'
        )
      )
  };
}

export function hijriToGregorian({
  year,
  month,
  day
}) {
  return moment(
    `${year}-${String(
      month
    ).padStart(
      2,
      '0'
    )}-${String(
      day
    ).padStart(
      2,
      '0'
    )}`,
    'iYYYY-iMM-iDD'
  );
}
