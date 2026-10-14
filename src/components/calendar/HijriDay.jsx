import {
  useMemo,
  useState
} from 'react';

import {
  createPortal
} from 'react-dom';

import {
  Bell,
  CheckCheck
} from 'lucide-react';

import {
  getRemindersForDate
} from '../../services/reminderService';

import {
  formatAppNumber
} from '../../services/settingsService';

export default function HijriDay({
  data,
  selectedDate,
  today,
  reminders = [],
  exceptions = [],
  completed = [],
  numberStyle = 'western',
  onSelect,
  onContextMenu
}) {
  const [
    tooltip,
    setTooltip
  ] = useState(null);

  const completedIds =
    useMemo(
      () =>
        new Set(
          completed.map(
            item =>
              item.occurrenceId
          )
        ),
      [
        completed
      ]
    );

  const dayState =
    useMemo(
      () => {
        if (!data?.gregorian) {
          return {
            visible: [],
            pending: [],
            done: []
          };
        }

        const all =
          getRemindersForDate(
            reminders,
            data?.gregorian,
            []
          );

        const deletedIds =
          new Set(
            exceptions.filter(
              id =>
                !completedIds.has(
                  id
                )
            )
          );

        const visible =
          all.filter(
            item =>
              !deletedIds.has(
                item.occurrenceId
              )
          );

        const done =
          visible.filter(
            item =>
              completedIds.has(
                item.occurrenceId
              )
          );

        const pending =
          visible.filter(
            item =>
              !completedIds.has(
                item.occurrenceId
              )
          );

        return {
          visible,
          pending,
          done
        };
      },
      [
        reminders,
        data?.gregorian,
        exceptions,
        completedIds
      ]
    );

  if (!data) {
    return (
      <div
        className="ui-calendar-empty h-full min-h-0 border-b border-l"
        style={{
          borderColor:
            'var(--calendar-grid-line)'
        }}
      />
    );
  }

  const isToday =
    data.gregorian?.isSame(
      today,
      'day'
    );

  const isSelected =
    data.gregorian?.isSame(
      selectedDate,
      'day'
    );

  const hasAnyReminders =
    dayState.visible.length >
    0;

  const allCompleted =
    dayState.done.length >
      0 &&
    dayState.pending.length ===
      0;

  const partiallyCompleted =
    dayState.done.length >
      0 &&
    dayState.pending.length >
      0;

  const enter = event => {
    if (!isSelected) {
      event.currentTarget.style.background =
        'var(--surface-hover)';
    }

    if (!hasAnyReminders) {
      return;
    }

    const rect =
      event.currentTarget
        .getBoundingClientRect();

    const tooltipWidth =
      240;

    const viewportPadding =
      12;

    const center =
      rect.left +
      rect.width / 2;

    const safeLeft =
      Math.min(
        Math.max(
          center,
          tooltipWidth / 2 +
            viewportPadding
        ),
        window.innerWidth -
          tooltipWidth / 2 -
          viewportPadding
      );

    const placement =
      rect.top < 210
        ? 'below'
        : 'above';

    setTooltip({
      left:
        safeLeft,
      top:
        placement ===
        'below'
          ? rect.bottom + 8
          : rect.top - 8,
      placement
    });
  };

  const leave = event => {
    if (!isSelected) {
      event.currentTarget.style.background =
        'transparent';
    }

    setTooltip(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() =>
          onSelect(
            data.gregorian.clone(),
            'hijri'
          )
        }
        onContextMenu={
          event => {
            event.preventDefault();

            onContextMenu(
              event,
              data.gregorian.clone(),
              'hijri'
            );
          }
        }
        onMouseEnter={enter}
        onMouseLeave={leave}
        className="ui-calendar-day relative flex items-center justify-center h-full min-h-0 w-full border-b border-l p-2 text-right transition-all"
        style={{
          borderColor:
            'var(--calendar-grid-line)',
          background:
            isSelected
              ? 'var(--calendar-selected-bg)'
              : 'transparent',
          color:
            isSelected
              ? 'var(--calendar-selected-text)'
              : 'var(--calendar-day-text)'
        }}
      >
        {isToday && (
          <span
            className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
            style={{
              background:
                'var(--calendar-today-bg)'
            }}
          />
        )}

        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-extrabold"
          style={{
            background:
              isToday
                ? 'var(--calendar-today-bg)'
                : 'transparent',
            color:
              isToday
                ? 'var(--calendar-today-text)'
                : isSelected
                  ? 'var(--calendar-selected-text)'
                  : 'var(--calendar-day-text)'
          }}
        >
          {formatAppNumber(
            data.day,
            numberStyle
          )}
        </span>

        {hasAnyReminders && (
          <span
            className="absolute bottom-1.5 left-1.5 flex h-6 min-w-6 items-center justify-center gap-1 rounded-full px-1.5"
            style={{
              background:
                'var(--surface)',
              border:
                '1px solid var(--border)',
              color:
                allCompleted
                  ? 'var(--reminder-done)'
                  : partiallyCompleted
                    ? 'var(--reminder-partial)'
                    : 'var(--reminder-pending)'
            }}
          >
            {allCompleted ? (
              <CheckCheck
                size={12}
                strokeWidth={2.4}
              />
            ) : (
              <Bell
                size={10}
                strokeWidth={2.2}
              />
            )}

            {dayState.visible.length >
              1 && (
              <span className="text-[9px] font-extrabold leading-none">
                {formatAppNumber(
                  dayState.visible.length,
                  numberStyle
                )}
              </span>
            )}
          </span>
        )}
      </button>

      {tooltip &&
        hasAnyReminders &&
        createPortal(
          <div
            className="fixed z-[9999] w-[240px] rounded-xl border p-2 text-right shadow-2xl backdrop-blur-xl"
            style={{
              left:
                tooltip.left,
              top:
                tooltip.top,
              transform:
                tooltip.placement ===
                'above'
                  ? 'translate(-50%, -100%)'
                  : 'translate(-50%, 0)',
              background:
                'var(--bg-secondary)',
              borderColor:
                'var(--calendar-grid-line)',
              boxShadow:
                '0 12px 34px rgba(0,0,0,0.24)',
              pointerEvents:
                'none'
            }}
          >
            <div
              className="mb-1.5 flex items-center justify-between text-[10px] font-bold"
              style={{
                color:
                  'var(--accent)'
              }}
            >
              <span>التذكيرات</span>

              {dayState.done.length >
                0 && (
                <span
                  style={{
                    color:
                      'var(--reminder-done)'
                  }}
                >
                  تم {
                    formatAppNumber(
                      dayState.done.length,
                      numberStyle
                    )
                  }
                </span>
              )}
            </div>

            <div className="space-y-1">
              {dayState.visible
                .slice(
                  0,
                  7
                )
                .map(
                  reminder => {
                    const done =
                      completedIds.has(
                        reminder.occurrenceId
                      );

                    return (
                      <div
                        key={
                          reminder.occurrenceId
                        }
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                        style={{
                          background:
                            'var(--surface-hover)'
                        }}
                      >
                        {done ? (
                          <CheckCheck
                            size={12}
                            strokeWidth={2.5}
                            style={{
                              color:
                                'var(--reminder-done)'
                            }}
                          />
                        ) : (
                          <Bell
                            size={10}
                            style={{
                              color:
                                'var(--reminder-pending)'
                            }}
                          />
                        )}

                        <span
                          className="min-w-0 flex-1 truncate text-[11px] font-semibold"
                          style={{
                            textDecoration:
                              done
                                ? 'line-through'
                                : 'none',
                            color:
                              done
                                ? 'var(--text-muted)'
                                : 'var(--text-primary)'
                          }}
                        >
                          {reminder.title}
                        </span>
                      </div>
                    );
                  }
                )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
