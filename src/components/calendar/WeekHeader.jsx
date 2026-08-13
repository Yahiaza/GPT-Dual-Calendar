const WEEK_DAYS = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة'
];

export default function WeekHeader({
  startIndex = 0
}) {
  const normalizedStart =
    (
      Number(
        startIndex
      ) % 7 +
      7
    ) % 7;

  const orderedDays = [
    ...WEEK_DAYS.slice(
      normalizedStart
    ),
    ...WEEK_DAYS.slice(
      0,
      normalizedStart
    )
  ];

  return (
    <div
      dir="rtl"
      className="ui-week-header mx-2 mb-1 grid grid-cols-7 overflow-hidden rounded-xl border"
      style={{
        background:
          'var(--calendar-weekday-bg)',
        borderColor:
          'var(--calendar-weekday-border)'
      }}
    >
      {orderedDays.map(
        day => (
          <div
            key={day}
            className="ui-weekday border-l py-2.5 text-center text-[11px] font-extrabold last:border-l-0"
            style={{
              color:
                'var(--calendar-weekday-text)',
              borderColor:
                'var(--calendar-weekday-border)'
            }}
          >
            {day}
          </div>
        )
      )}
    </div>
  );
}
