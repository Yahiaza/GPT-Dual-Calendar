import {
  Bell,
  CalendarDays,
  Search
} from 'lucide-react';

import moment from 'moment';

import {
  getRemindersForRange
} from '../../services/reminderService';

export default function RemindersView({
  reminders,
  exceptions,
  onOpenReminder
}) {
  const rangeStart =
    moment()
      .subtract(
        2,
        'years'
      );

  const rangeEnd =
    moment()
      .add(
        5,
        'years'
      );

  const occurrences =
    getRemindersForRange(
      reminders,
      rangeStart,
      rangeEnd,
      exceptions
    );

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold">
            التذكيرات
          </h1>

          <p
            className="mt-1 text-xs"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            استعراض التذكيرات الحالية والمتكررة
          </p>
        </div>

        <div
          className="rounded-xl px-4 py-2 text-sm font-bold"
          style={{
            background:
              'var(--accent-soft)',
            color:
              'var(--accent)'
          }}
        >
          {
            occurrences.length
          }
          {' '}
          موعد
        </div>
      </div>

      {occurrences.length ===
        0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div
            className="text-center"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            <Bell
              size={38}
              className="mx-auto mb-3 opacity-40"
            />

            لا توجد تذكيرات
          </div>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto">
          {occurrences.map(
            occurrence => (
              <button
                key={
                  occurrence.occurrenceId
                }
                type="button"
                onClick={() =>
                  onOpenReminder(
                    occurrence
                  )
                }
                className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-right transition-transform hover:scale-[1.005]"
                style={{
                  background:
                    'var(--surface)',
                  borderColor:
                    'var(--border)'
                }}
              >
                <div>
                  <div className="text-sm font-bold">
                    {
                      occurrence.title
                    }
                  </div>

                  <div
                    className="mt-1 flex items-center gap-2 text-[11px]"
                    style={{
                      color:
                        'var(--text-muted)'
                    }}
                  >
                    <CalendarDays
                      size={13}
                    />

                    {
                      occurrence.date
                    }

                    <span>
                      •
                    </span>

                    {
                      occurrence.time
                    }
                  </div>
                </div>

                <Bell
                  size={16}
                  style={{
                    color:
                      'var(--accent)'
                  }}
                />
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
