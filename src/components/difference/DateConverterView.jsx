import {
  ArrowLeftRight,
  CalendarDays,
  Info,
  Moon
} from 'lucide-react';

import {
  useMemo,
  useState
} from 'react';

import moment from 'moment';
import 'moment-hijri';

import {
  getHijriParts,
  hijriToGregorian,
  HIJRI_MONTHS
} from '../../services/hijriService';

import {
  formatAppNumber,
  normalizeAppDigits
} from '../../services/settingsService';

const GREGORIAN_MONTHS = [
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

function NumericField({
  value,
  onChange,
  placeholder,
  maxLength,
  numberStyle
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={
        formatAppNumber(
          value,
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
        event =>
          onChange(
            normalizeAppDigits(
              event.target.value
            )
              .replace(
                /\D/g,
                ''
              )
              .slice(
                0,
                maxLength
              )
          )
      }
      placeholder={placeholder}
      className="block h-12 w-full min-w-0 rounded-xl border px-3 text-center text-base font-extrabold outline-none transition-colors"
      style={{
        background:
          'var(--bg-secondary)',
        color:
          'var(--text-primary)',
        borderColor:
          'var(--border)'
      }}
    />
  );
}

function MonthSelect({
  value,
  onChange,
  months
}) {
  return (
    <select
      value={value}
      onChange={
        event =>
          onChange(
            event.target.value
          )
      }
      className="block h-12 w-full min-w-0 rounded-xl border px-3 text-center text-base font-extrabold outline-none transition-colors"
      style={{
        background:
          'var(--bg-secondary)',
        color:
          'var(--text-primary)',
        borderColor:
          'var(--border)'
      }}
    >
      {months.map(
        (
          name,
          index
        ) => (
          <option
            key={name}
            value={
              index + 1
            }
          >
            {name}
          </option>
        )
      )}
    </select>
  );
}

function DateFields({
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
  months,
  numberStyle
}) {
  return (
    <div
      dir="rtl"
      className="grid w-full min-w-0 grid-cols-[82px_minmax(150px,1fr)_108px] gap-3"
    >
      <div className="min-w-0">
        <div
          className="mb-1.5 text-center text-[10px] font-bold"
          style={{
            color:
              'var(--text-muted)'
          }}
        >
          اليوم
        </div>

        <NumericField
          value={day}
          onChange={setDay}
          placeholder="يوم"
          maxLength={2}
          numberStyle={
            numberStyle
          }
        />
      </div>

      <div className="min-w-0">
        <div
          className="mb-1.5 text-center text-[10px] font-bold"
          style={{
            color:
              'var(--text-muted)'
          }}
        >
          الشهر
        </div>

        <MonthSelect
          value={month}
          onChange={setMonth}
          months={months}
        />
      </div>

      <div className="min-w-0">
        <div
          className="mb-1.5 text-center text-[10px] font-bold"
          style={{
            color:
              'var(--text-muted)'
          }}
        >
          السنة
        </div>

        <NumericField
          value={year}
          onChange={setYear}
          placeholder="سنة"
          maxLength={4}
          numberStyle={
            numberStyle
          }
        />
      </div>
    </div>
  );
}

function ConversionCard({
  sourceTitle,
  sourceAccent,
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
  months,
  numberStyle,
  resultTitle,
  resultIcon: ResultIcon,
  result,
  resultAccent = 'var(--accent)'
}) {
  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        background:
          'var(--surface)',
        borderColor:
          'var(--border)',
        boxShadow:
          'var(--shadow)'
      }}
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_34px_minmax(0,0.9fr)] items-center gap-4">
        <div className="min-w-0">
          <div
            className="mb-3 flex h-6 items-center gap-2 text-sm font-extrabold"
            style={{
              color:
                sourceAccent
            }}
          >
            <CalendarDays size={16} />
            {sourceTitle}
          </div>

          <DateFields
            day={day}
            setDay={setDay}
            month={month}
            setMonth={setMonth}
            year={year}
            setYear={setYear}
            months={months}
            numberStyle={
              numberStyle
            }
          />
        </div>

        <div
          className="flex h-full items-center justify-center text-2xl font-extrabold"
          style={{
            color:
              'var(--text-muted)'
          }}
          aria-hidden="true"
        >
          =
        </div>

        <div className="min-w-0">
          <div
            className="mb-3 flex h-6 items-center gap-2 text-sm font-extrabold"
            style={{
              color:
                'var(--text-secondary)'
            }}
          >
            <ResultIcon size={16} />
            {resultTitle}
          </div>

          <div
            className="flex min-h-[76px] items-center justify-center break-words rounded-xl border px-4 py-3 text-center text-xl font-extrabold leading-8"
            style={{
              borderColor:
                'var(--border)',
              background:
                'var(--bg-secondary)',
              color:
                resultAccent
            }}
          >
            {result}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DateConverterView({
  hijriAdjustment = 0,
  numberStyle = 'western'
}) {
  const today =
    moment();

  const todayHijri =
    getHijriParts(
      today,
      hijriAdjustment
    );

  const [
    gregorianDay,
    setGregorianDay
  ] = useState(
    () =>
      String(
        today.date()
      )
  );

  const [
    gregorianMonth,
    setGregorianMonth
  ] = useState(
    () =>
      String(
        today.month() + 1
      )
  );

  const [
    gregorianYear,
    setGregorianYear
  ] = useState(
    () =>
      String(
        today.year()
      )
  );

  const [
    hijriDay,
    setHijriDay
  ] = useState(
    () =>
      String(
        todayHijri.day
      )
  );

  const [
    hijriMonth,
    setHijriMonth
  ] = useState(
    () =>
      String(
        todayHijri.month
      )
  );

  const [
    hijriYear,
    setHijriYear
  ] = useState(
    () =>
      String(
        todayHijri.year
      )
  );

  const gregorianMoment =
    useMemo(
      () => {
        const day =
          Number(
            gregorianDay
          );

        const month =
          Number(
            gregorianMonth
          );

        const year =
          Number(
            gregorianYear
          );

        if (
          !day ||
          !month ||
          !year ||
          month < 1 ||
          month > 12
        ) {
          return null;
        }

        const value =
          moment({
            year,
            month:
              month - 1,
            day
          });

        if (
          !value.isValid() ||
          value.year() !==
            year ||
          value.month() !==
            month - 1 ||
          value.date() !==
            day
        ) {
          return null;
        }

        return value;
      },
      [
        gregorianDay,
        gregorianMonth,
        gregorianYear
      ]
    );

  const gregorianToHijri =
    useMemo(
      () => {
        if (
          !gregorianMoment
        ) {
          return null;
        }

        return getHijriParts(
          gregorianMoment,
          hijriAdjustment
        );
      },
      [
        gregorianMoment,
        hijriAdjustment
      ]
    );

  const hijriToGregorianResult =
    useMemo(
      () => {
        const day =
          Number(
            hijriDay
          );

        const month =
          Number(
            hijriMonth
          );

        const year =
          Number(
            hijriYear
          );

        if (
          !day ||
          !month ||
          !year ||
          month < 1 ||
          month > 12 ||
          day < 1 ||
          day > 30
        ) {
          return null;
        }

        const value =
          hijriToGregorian({
            year,
            month,
            day
          })
            .clone()
            .subtract(
              hijriAdjustment,
              'days'
            );

        return value.isValid()
          ? value
          : null;
      },
      [
        hijriDay,
        hijriMonth,
        hijriYear,
        hijriAdjustment
      ]
    );

  const gregorianResultText =
    hijriToGregorianResult
      ? `${formatAppNumber(
          hijriToGregorianResult.date(),
          numberStyle
        )} ${
          GREGORIAN_MONTHS[
            hijriToGregorianResult.month()
          ]
        } ${formatAppNumber(
          hijriToGregorianResult.year(),
          numberStyle
        )}`
      : 'تاريخ غير صالح';

  const hijriResultText =
    gregorianToHijri
      ? `${formatAppNumber(
          gregorianToHijri.day,
          numberStyle
        )} ${
          gregorianToHijri.monthName
        } ${formatAppNumber(
          gregorianToHijri.year,
          numberStyle
        )} هـ`
      : 'تاريخ غير صالح';

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-[940px]">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <ArrowLeftRight
              size={22}
              style={{
                color:
                  'var(--accent)'
              }}
            />

            <h1 className="text-2xl font-extrabold">
              تحويل التاريخ
            </h1>
          </div>

          <p
            className="mt-1 text-sm font-semibold"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            اكتب التاريخ في أي من القسمين وستظهر لك النتيجة المقابلة مباشرة
          </p>
        </div>

        <div className="space-y-4">
          <ConversionCard
            sourceTitle="التاريخ الميلادي"
            sourceAccent="var(--accent)"
            day={
              gregorianDay
            }
            setDay={
              setGregorianDay
            }
            month={
              gregorianMonth
            }
            setMonth={
              setGregorianMonth
            }
            year={
              gregorianYear
            }
            setYear={
              setGregorianYear
            }
            months={
              GREGORIAN_MONTHS
            }
            numberStyle={
              numberStyle
            }
            resultTitle="المقابل الهجري"
            resultIcon={Moon}
            result={
              hijriResultText
            }
          />

          <ConversionCard
            sourceTitle="التاريخ الهجري"
            sourceAccent="var(--converter-hijri)"
            day={
              hijriDay
            }
            setDay={
              setHijriDay
            }
            month={
              hijriMonth
            }
            setMonth={
              setHijriMonth
            }
            year={
              hijriYear
            }
            setYear={
              setHijriYear
            }
            months={
              HIJRI_MONTHS
            }
            numberStyle={
              numberStyle
            }
            resultTitle="المقابل الميلادي"
            resultIcon={
              CalendarDays
            }
            result={
              gregorianResultText
            }
            resultAccent="var(--converter-hijri)"
          />
        </div>

        <div
          className="mt-5 flex items-start gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold leading-6"
          style={{
            background:
              'var(--surface)',
            borderColor:
              'var(--border)',
            color:
              'var(--text-secondary)'
          }}
        >
          <Info
            size={16}
            className="mt-0.5 shrink-0"
          />

          <div>
            تعتمد عملية التحويل على تقويم أم القرى، وقد يختلف التاريخ الهجري يومًا واحدًا في بعض الدول.

            <div className="mt-1 font-extrabold">
              ضبط التاريخ الهجري المستخدم حاليًا:
              {' '}
              <span
                style={{
                  color:
                    'var(--accent)'
                }}
              >
                {hijriAdjustment >
                0
                  ? '+'
                  : ''}
                {formatAppNumber(
                  hijriAdjustment,
                  numberStyle
                )}
              </span>
              {' '}
              يوم
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
