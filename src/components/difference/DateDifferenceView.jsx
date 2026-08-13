import {
  Calculator
} from 'lucide-react';

import {
  useMemo,
  useState
} from 'react';

import {
  calculateDateDifference
} from '../../services/dateDifferenceService';

function DateBox({
  title,
  value,
  onChange
}) {
  const update =
    (
      key,
      next
    ) => {
      onChange({
        ...value,
        [key]:
          next
      });
    };

  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        background:
          'var(--surface)',
        borderColor:
          'var(--border)'
      }}
    >
      <div className="mb-3 text-sm font-bold">
        {title}
      </div>

      <select
        value={
          value.calendar
        }
        onChange={
          event =>
            update(
              'calendar',
              event.target.value
            )
        }
        className="mb-3 w-full rounded-xl border px-3 py-2 text-sm"
        style={{
          background:
            'var(--bg-secondary)',
          borderColor:
            'var(--border)'
        }}
      >
        <option value="gregorian">
          ميلادي
        </option>

        <option value="hijri">
          هجري
        </option>
      </select>

      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          value={value.day}
          onChange={
            event =>
              update(
                'day',
                event.target.value
              )
          }
          placeholder="اليوم"
          className="rounded-xl border px-3 py-2 text-center"
          style={{
            background:
              'var(--bg-secondary)',
            borderColor:
              'var(--border)'
          }}
        />

        <input
          type="number"
          value={
            value.month
          }
          onChange={
            event =>
              update(
                'month',
                event.target.value
              )
          }
          placeholder="الشهر"
          className="rounded-xl border px-3 py-2 text-center"
          style={{
            background:
              'var(--bg-secondary)',
            borderColor:
              'var(--border)'
          }}
        />

        <input
          type="number"
          value={
            value.year
          }
          onChange={
            event =>
              update(
                'year',
                event.target.value
              )
          }
          placeholder="السنة"
          className="rounded-xl border px-3 py-2 text-center"
          style={{
            background:
              'var(--bg-secondary)',
            borderColor:
              'var(--border)'
          }}
        />
      </div>
    </div>
  );
}

export default function DateDifferenceView() {
  const [
    first,
    setFirst
  ] = useState({
    calendar:
      'gregorian',
    day: 10,
    month: 8,
    year: 2026
  });

  const [
    second,
    setSecond
  ] = useState({
    calendar:
      'gregorian',
    day: 10,
    month: 8,
    year: 2027
  });

  const result =
    useMemo(
      () =>
        calculateDateDifference(
          first,
          second
        ),
      [
        first,
        second
      ]
    );

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Calculator
            size={20}
            style={{
              color:
                'var(--accent)'
            }}
          />

          <h1 className="text-xl font-extrabold">
            فرق التاريخين
          </h1>
        </div>

        <p
          className="mt-1 text-xs"
          style={{
            color:
              'var(--text-muted)'
          }}
        >
          يمكن مقارنة ميلادي أو هجري أو المزج بينهما
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DateBox
          title="التاريخ الأول"
          value={first}
          onChange={
            setFirst
          }
        />

        <DateBox
          title="التاريخ الثاني"
          value={second}
          onChange={
            setSecond
          }
        />
      </div>

      <div
        className="mt-4 flex-1 rounded-2xl border p-6"
        style={{
          background:
            'var(--surface)',
          borderColor:
            'var(--border)'
        }}
      >
        {result ? (
          <div className="grid h-full place-items-center">
            <div className="text-center">
              <div
                className="text-sm font-semibold"
                style={{
                  color:
                    'var(--text-muted)'
                }}
              >
                إجمالي الفرق
              </div>

              <div
                className="mt-2 text-4xl font-extrabold"
                style={{
                  color:
                    'var(--accent)'
                }}
              >
                {
                  result.totalDays
                }
              </div>

              <div
                className="mt-1 text-sm font-bold"
                style={{
                  color:
                    'var(--accent)'
                }}
              >
                يوم
              </div>

              <div className="mt-6 text-lg font-bold">
                {
                  result.years
                }
                {' '}
                سنة
                {' • '}
                {
                  result.months
                }
                {' '}
                شهر
                {' • '}
                {
                  result.days
                }
                {' '}
                يوم
              </div>
            </div>
          </div>
        ) : (
          <div className="grid h-full place-items-center text-sm">
            أدخل تاريخين صالحين
          </div>
        )}
      </div>
    </div>
  );
}
