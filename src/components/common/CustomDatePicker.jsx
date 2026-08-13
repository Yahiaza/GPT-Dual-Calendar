import {
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import moment from 'moment';

import {
  formatAppNumber,
  normalizeAppDigits
} from '../../services/settingsService';

const MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر'
];

const WEEKDAYS = [
  'سبت',
  'أحد',
  'إثنين',
  'ثلاثاء',
  'أربعاء',
  'خميس',
  'جمعة'
];

function clampDigits(
  value,
  maxLength
) {
  return normalizeAppDigits(
    value
  )
    .replace(
      /\D/g,
      ''
    )
    .slice(
      0,
      maxLength
    );
}

export default function CustomDatePicker({
  value,
  onChange,
  numberStyle = 'western',
  onTabOut
}) {
  const parsed =
    value
      ? moment(
          value,
          'YYYY-MM-DD',
          true
        )
      : moment();

  const [
    open,
    setOpen
  ] = useState(false);

  const [
    view,
    setView
  ] = useState(
    () =>
      (
        parsed.isValid()
          ? parsed
          : moment()
      )
        .clone()
        .startOf('month')
  );

  const [
    day,
    setDay
  ] = useState(
    parsed.isValid()
      ? parsed.format(
          'DD'
        )
      : ''
  );

  const [
    month,
    setMonth
  ] = useState(
    parsed.isValid()
      ? parsed.format(
          'MM'
        )
      : ''
  );

  const [
    year,
    setYear
  ] = useState(
    parsed.isValid()
      ? parsed.format(
          'YYYY'
        )
      : ''
  );

  const dayRef =
    useRef(null);

  const monthRef =
    useRef(null);

  const yearRef =
    useRef(null);

  useEffect(() => {
    const next =
      moment(
        value,
        'YYYY-MM-DD',
        true
      );

    if (
      next.isValid()
    ) {
      setDay(
        next.format(
          'DD'
        )
      );

      setMonth(
        next.format(
          'MM'
        )
      );

      setYear(
        next.format(
          'YYYY'
        )
      );

      setView(
        next
          .clone()
          .startOf('month')
      );
    }
  }, [value]);

  useEffect(() => {
    const handleEscape =
      event => {
        if (
          event.key ===
          'Escape'
        ) {
          setOpen(false);
        }
      };

    window.addEventListener(
      'keydown',
      handleEscape
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleEscape
      );
  }, []);

  const commit =
    (
      nextDay = day,
      nextMonth = month,
      nextYear = year
    ) => {
      if (
        nextDay.length !== 2 ||
        nextMonth.length !== 2 ||
        nextYear.length !== 4
      ) {
        return;
      }

      const candidate =
        moment(
          `${nextYear}-${nextMonth}-${nextDay}`,
          'YYYY-MM-DD',
          true
        );

      if (
        candidate.isValid()
      ) {
        onChange(
          candidate.format(
            'YYYY-MM-DD'
          )
        );
      }
    };

  const days =
    useMemo(
      () => {
        const first =
          view
            .clone()
            .startOf('month');

        const offset =
          (
            first.day() -
            6 +
            7
          ) % 7;

        const result = [];

        for (
          let i = 0;
          i < offset;
          i += 1
        ) {
          result.push(null);
        }

        const total =
          view.daysInMonth();

        for (
          let currentDay = 1;
          currentDay <= total;
          currentDay += 1
        ) {
          result.push(
            view
              .clone()
              .date(
                currentDay
              )
          );
        }

        return result;
      },
      [view]
    );

  const selected =
    moment(
      value,
      'YYYY-MM-DD',
      true
    );

  return (
    <div className="relative">
      <div
        className="flex items-center rounded-xl border"
        style={{
          background:
            'var(--bg-secondary)',
          borderColor:
            'var(--border)'
        }}
      >
        <div
          dir="ltr"
          className="flex min-w-0 flex-1 items-center justify-center gap-1 px-2"
        >
          <input
            ref={dayRef}
            type="text"
            inputMode="numeric"
            value={
              formatAppNumber(
                day,
                numberStyle
              )
            }
            onFocus={
              event =>
                event.target.select()
            }
            onClick={
              event =>
                event.target.select()
            }
            onChange={
              event => {
                const next =
                  clampDigits(
                    event.target.value,
                    2
                  );

                setDay(
                  next
                );

                if (
                  next.length === 2
                ) {
                  monthRef.current
                    ?.focus();

                  monthRef.current
                    ?.select();

                  commit(
                    next,
                    month,
                    year
                  );
                }
              }
            }
            onKeyDown={
              event => {
                if (
                  event.key ===
                  'Tab' &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  monthRef.current
                    ?.focus();
                  monthRef.current
                    ?.select();
                }
              }
            }
            placeholder="DD"
            className="w-9 bg-transparent py-2.5 text-center text-sm font-bold outline-none"
          />

          <span
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            /
          </span>

          <input
            ref={monthRef}
            type="text"
            inputMode="numeric"
            value={
              formatAppNumber(
                month,
                numberStyle
              )
            }
            onFocus={
              event =>
                event.target.select()
            }
            onClick={
              event =>
                event.target.select()
            }
            onChange={
              event => {
                const next =
                  clampDigits(
                    event.target.value,
                    2
                  );

                setMonth(
                  next
                );

                if (
                  next.length === 2
                ) {
                  yearRef.current
                    ?.focus();

                  yearRef.current
                    ?.select();

                  commit(
                    day,
                    next,
                    year
                  );
                }
              }
            }
            onKeyDown={
              event => {
                if (
                  event.key ===
                  'Tab' &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  yearRef.current
                    ?.focus();
                  yearRef.current
                    ?.select();
                }

                if (
                  event.key ===
                  'Tab' &&
                  event.shiftKey
                ) {
                  event.preventDefault();
                  dayRef.current
                    ?.focus();
                  dayRef.current
                    ?.select();
                }
              }
            }
            placeholder="MM"
            className="w-9 bg-transparent py-2.5 text-center text-sm font-bold outline-none"
          />

          <span
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            /
          </span>

          <input
            ref={yearRef}
            type="text"
            inputMode="numeric"
            value={
              formatAppNumber(
                year,
                numberStyle
              )
            }
            onFocus={
              event =>
                event.target.select()
            }
            onClick={
              event =>
                event.target.select()
            }
            onChange={
              event => {
                const next =
                  clampDigits(
                    event.target.value,
                    4
                  );

                setYear(
                  next
                );

                if (
                  next.length === 4
                ) {
                  commit(
                    day,
                    month,
                    next
                  );
                }
              }
            }
            onBlur={() =>
              commit()
            }
            onKeyDown={
              event => {
                if (
                  event.key ===
                  'Tab' &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  commit();

                  if (
                    typeof onTabOut ===
                    'function'
                  ) {
                    onTabOut();
                  }
                }

                if (
                  event.key ===
                  'Tab' &&
                  event.shiftKey
                ) {
                  event.preventDefault();
                  monthRef.current
                    ?.focus();
                  monthRef.current
                    ?.select();
                }

                if (
                  event.key ===
                  'Enter'
                ) {
                  commit();
                }
              }
            }
            placeholder="YYYY"
            className="w-14 bg-transparent py-2.5 text-center text-sm font-bold outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() =>
            setOpen(
              current =>
                !current
            )
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center border-r"
          style={{
            borderColor:
              'var(--border)',
            color:
              open
                ? 'var(--accent)'
                : 'var(--text-muted)'
          }}
          title="فتح التقويم"
        >
          <CalendarDays
            size={15}
          />
        </button>
      </div>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-[300] w-[292px] rounded-2xl border p-3 shadow-2xl"
          style={{
            background:
              'var(--bg-secondary)',
            borderColor:
              'var(--border)',
            boxShadow:
              'var(--shadow)'
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setView(
                  current =>
                    current
                      .clone()
                      .subtract(
                        1,
                        'month'
                      )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background:
                  'var(--surface-hover)'
              }}
            >
              <ChevronRight
                size={15}
              />
            </button>

            <div className="text-sm font-extrabold">
              {MONTHS[
                view.month()
              ]}
              {' '}
              {formatAppNumber(
                view.year(),
                numberStyle
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setView(
                  current =>
                    current
                      .clone()
                      .add(
                        1,
                        'month'
                      )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background:
                  'var(--surface-hover)'
              }}
            >
              <ChevronLeft
                size={15}
              />
            </button>
          </div>

          <div
            className="mb-1 grid grid-cols-7 rounded-xl px-1 py-1.5"
            style={{
              background:
                'var(--accent-soft)'
            }}
          >
            {WEEKDAYS.map(
              weekday => (
                <div
                  key={weekday}
                  className="text-center text-[9px] font-bold"
                  style={{
                    color:
                      'var(--accent)'
                  }}
                >
                  {weekday}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map(
              (
                currentDate,
                index
              ) => {
                if (
                  !currentDate
                ) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="h-8"
                    />
                  );
                }

                const active =
                  selected.isValid() &&
                  currentDate.isSame(
                    selected,
                    'day'
                  );

                const isToday =
                  currentDate.isSame(
                    moment(),
                    'day'
                  );

                return (
                  <button
                    key={
                      currentDate.format(
                        'YYYY-MM-DD'
                      )
                    }
                    type="button"
                    onClick={() => {
                      onChange(
                        currentDate.format(
                          'YYYY-MM-DD'
                        )
                      );

                      setOpen(
                        false
                      );
                    }}
                    className="flex h-8 items-center justify-center rounded-lg text-[11px] font-bold"
                    style={{
                      background:
                        active
                          ? 'var(--accent)'
                          : isToday
                            ? 'var(--accent-soft)'
                            : 'transparent',
                      color:
                        active
                          ? '#fff'
                          : isToday
                            ? 'var(--accent)'
                            : 'var(--text-primary)'
                    }}
                  >
                    {formatAppNumber(
                      currentDate.date(),
                      numberStyle
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}
