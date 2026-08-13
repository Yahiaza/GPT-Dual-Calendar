import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect
} from 'react';

import {
  formatAppNumber,
  normalizeAppDigits
} from '../../services/settingsService';

function digits(
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

const CustomTimePicker =
  forwardRef(
    function CustomTimePicker(
      {
        value = '09:00',
        onChange,
        numberStyle = 'western',
        timeFormat = '24'
      },
      ref
    ) {
      const [
        hour,
        setHour
      ] = useState(
        String(
          value
        ).split(':')[0] ||
        '09'
      );

      const [
        minute,
        setMinute
      ] = useState(
        String(
          value
        ).split(':')[1] ||
        '00'
      );

      const [
        period,
        setPeriod
      ] = useState(
        Number(
          String(
            value
          ).split(':')[0] ||
            9
        ) >= 12
          ? 'م'
          : 'ص'
      );

      const hourRef =
        useRef(null);

      const minuteRef =
        useRef(null);

      useImperativeHandle(
        ref,
        () => ({
          focusHour() {
            hourRef.current
              ?.focus();
            hourRef.current
              ?.select();
          }
        })
      );

      useEffect(() => {
        const [
          rawHour,
          rawMinute
        ] =
          String(
            value || '09:00'
          ).split(':');

        const hour24 =
          Number(
            rawHour
          ) || 0;

        const is12 =
          timeFormat ===
          '12';

        if (is12) {
          setHour(
            String(
              hour24 % 12 ||
              12
            ).padStart(
              2,
              '0'
            )
          );

          setPeriod(
            hour24 >= 12
              ? 'م'
              : 'ص'
          );
        } else {
          setHour(
            String(
              hour24
            ).padStart(
              2,
              '0'
            )
          );
        }

        setMinute(
          String(
            Number(
              rawMinute
            ) || 0
          ).padStart(
            2,
            '0'
          )
        );
      }, [
        value,
        timeFormat
      ]);

      const commit =
        (
          nextHour = hour,
          nextMinute = minute,
          nextPeriod = period
        ) => {
          if (
            nextHour.length !== 2 ||
            nextMinute.length !== 2
          ) {
            return;
          }

          let parsedHour =
            Number(
              nextHour
            );

          const parsedMinute =
            Number(
              nextMinute
            );

          if (
            parsedMinute < 0 ||
            parsedMinute > 59
          ) {
            return;
          }

          if (
            timeFormat ===
            '12'
          ) {
            if (
              parsedHour < 1 ||
              parsedHour > 12
            ) {
              return;
            }

            parsedHour =
              parsedHour % 12;

            if (
              nextPeriod ===
              'م'
            ) {
              parsedHour += 12;
            }
          } else if (
            parsedHour < 0 ||
            parsedHour > 23
          ) {
            return;
          }

          onChange(
            `${String(
              parsedHour
            ).padStart(
              2,
              '0'
            )}:${String(
              parsedMinute
            ).padStart(
              2,
              '0'
            )}`
          );
        };

      return (
        <div
          dir="ltr"
          className="flex items-center rounded-xl border"
          style={{
            background:
              'var(--bg-secondary)',
            borderColor:
              'var(--border)'
          }}
        >
          <input
            ref={
              hourRef
            }
            type="text"
            inputMode="numeric"
            value={
              formatAppNumber(
                hour,
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
                  digits(
                    event.target.value,
                    2
                  );

                setHour(
                  next
                );

                if (
                  next.length === 2
                ) {
                  minuteRef.current
                    ?.focus();

                  minuteRef.current
                    ?.select();

                  commit(
                    next,
                    minute,
                    period
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
                  minuteRef.current
                    ?.focus();
                  minuteRef.current
                    ?.select();
                }
              }
            }
            placeholder="HH"
            className="w-12 bg-transparent py-2.5 text-center text-sm font-bold outline-none"
          />

          <span
            className="font-bold"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            :
          </span>

          <input
            ref={
              minuteRef
            }
            type="text"
            inputMode="numeric"
            value={
              formatAppNumber(
                minute,
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
                  digits(
                    event.target.value,
                    2
                  );

                setMinute(
                  next
                );

                if (
                  next.length === 2
                ) {
                  commit(
                    hour,
                    next,
                    period
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
                  event.shiftKey
                ) {
                  event.preventDefault();
                  hourRef.current
                    ?.focus();
                  hourRef.current
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
            placeholder="MM"
            className="w-12 bg-transparent py-2.5 text-center text-sm font-bold outline-none"
          />

          {timeFormat ===
            '12' && (
            <div
              className="ml-1 flex overflow-hidden rounded-lg border"
              style={{
                borderColor:
                  'var(--border)'
              }}
            >
              {[
                'ص',
                'م'
              ].map(
                item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setPeriod(
                        item
                      );

                      commit(
                        hour,
                        minute,
                        item
                      );
                    }}
                    className="px-2 py-2 text-[10px] font-extrabold"
                    style={{
                      background:
                        period ===
                        item
                          ? 'var(--accent)'
                          : 'transparent',
                      color:
                        period ===
                        item
                          ? '#fff'
                          : 'var(--text-muted)'
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      );
    }
  );

export default CustomTimePicker;
