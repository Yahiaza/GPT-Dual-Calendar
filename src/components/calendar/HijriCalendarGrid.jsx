import HijriDay from './HijriDay';
import WeekHeader from './WeekHeader';

export default function HijriCalendarGrid({
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
              data,
              index
            ) => (
              <HijriDay
                key={
                  data
                    ? `${data.year}-${data.month}-${data.day}`
                    : `empty-${index}`
                }
                data={data}
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
