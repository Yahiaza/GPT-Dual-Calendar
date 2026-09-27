import CalendarDay from './CalendarDay';
import WeekHeader from './WeekHeader';

export default function CalendarGrid({
  days,
  selectedDate,
  today,
  reminders = [],
  exceptions = [],
  completed = [],
  numberStyle = 'western',
  onSelect,
  onContextMenu
}) {
  const normalizedDays = [
    ...days
  ];

  while (
    normalizedDays.length <
    42
  ) {
    normalizedDays.push(
      null
    );
  }

  return (
    <div className="ui-calendar-grid flex h-full min-h-0 w-full flex-col">
      <div className="shrink-0">
        <WeekHeader />
      </div>

      <div
        dir="rtl"
        className="ui-calendar-grid-cells grid min-h-0 flex-1 grid-cols-7 grid-rows-6"
      >
        {normalizedDays
          .slice(
            0,
            42
          )
          .map(
            (
              date,
              index
            ) => (
              <CalendarDay
                key={
                  date
                    ? date.format(
                        'YYYY-MM-DD'
                      )
                    : `empty-${index}`
                }
                date={date}
                selectedDate={
                  selectedDate
                }
                today={today}
                reminders={
                  reminders
                }
                exceptions={
                  exceptions
                }
                completed={
                  completed
                }
                numberStyle={
                  numberStyle
                }
                onSelect={
                  onSelect
                }
                onContextMenu={
                  onContextMenu
                }
              />
            )
          )}
      </div>
    </div>
  );
}
