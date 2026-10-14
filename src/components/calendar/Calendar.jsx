import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import moment from 'moment';
import 'moment-hijri';

import {
  Eye,
  EyeOff
} from 'lucide-react';

import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import HijriCalendarGrid from './HijriCalendarGrid';

import {
  formatCalendarMonthTitle,
  getGregorianDays,
  getToday
} from '../../services/calendarService';

import {
  getHijriMonthDays,
  getHijriMonthForDate,
  formatHijriDate,
  HIJRI_MONTHS
} from '../../services/hijriService';

import {
  formatAppNumber
} from '../../services/settingsService';

const ARABIC_WEEKDAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

const ARABIC_MONTHS = [
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

export default function Calendar({
  onContextMenu,
  hijriAdjustment = 0,
  setHijriAdjustment,
  reminders = [],
  exceptions = [],
  completed = [],
  numberStyle = 'western',
  reverseCalendarOrder = false,
  onSelectedDateChange
}) {
  /*
   * "today" كان قبل كده بيتحسب مرة واحدة فقط عند فتح التطبيق.
   * لذلك لو التطبيق فضل مفتوح بعد منتصف الليل، اليوم الحالي
   * كان يظل يوم أمس. نخليه State ويتحدث عند تغيّر تاريخ النظام.
   */
  const [
    today,
    setToday
  ] = useState(
    () => getToday()
  );

  const lastTodayRef =
    useRef(
      today.clone()
    );

  const [
    liveClock,
    setLiveClock
  ] = useState(
    () => new Date()
  );

  useEffect(() => {
    const refreshSystemTime =
      () => {
        setLiveClock(
          new Date()
        );

        const nextToday =
          getToday();

        setToday(
          currentToday =>
            currentToday.isSame(
              nextToday,
              'day'
            )
              ? currentToday
              : nextToday
        );
      };

    /*
     * فحص كل ثانية يخدم الساعة الحالية أيضًا.
     * بعد Sleep / Resume أول Tick يعيد قراءة تاريخ Windows
     * فيصحح اليوم فورًا بدون إعادة تشغيل التطبيق.
     */
    const timer =
      setInterval(
        refreshSystemTime,
        1000
      );

    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          'visible'
        ) {
          refreshSystemTime();
        }
      };

    window.addEventListener(
      'focus',
      refreshSystemTime
    );

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      clearInterval(
        timer
      );

      window.removeEventListener(
        'focus',
        refreshSystemTime
      );

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, []);

  const liveClockText =
    useMemo(
      () => {
        const hours24 =
          liveClock.getHours();

        const minutes =
          liveClock.getMinutes();

        const period =
          hours24 >= 12
            ? 'م'
            : 'ص';

        const hours12 =
          hours24 % 12 ||
          12;

        return `${formatAppNumber(
          String(
            hours12
          ).padStart(
            2,
            '0'
          ),
          numberStyle
        )}:${formatAppNumber(
          String(
            minutes
          ).padStart(
            2,
            '0'
          ),
          numberStyle
        )} ${period}`;
      },
      [
        liveClock,
        numberStyle
      ]
    );

  const [
    selectedDate,
    setSelectedDate
  ] = useState(
    () => moment()
  );

  /*
   * إظهار/إخفاء التقويم الهجري.
   * يتم حفظ الاختيار محليًا حتى يظل كما اختاره المستخدم.
   */
  const [
    showHijri,
    setShowHijri
  ] = useState(
    () =>
      localStorage.getItem(
        'gpt-dual-calendar-show-hijri'
      ) !== 'false'
  );

  useEffect(() => {
    localStorage.setItem(
      'gpt-dual-calendar-show-hijri',
      String(
        showHijri
      )
    );
  }, [
    showHijri
  ]);

  const [
    gregorianView,
    setGregorianView
  ] = useState(
    () =>
      moment().startOf(
        'month'
      )
  );

  const initialHijri =
    useMemo(
      () =>
        getHijriMonthForDate(
          moment(),
          hijriAdjustment
        ),
      []
    );

  const [
    hijriView,
    setHijriView
  ] = useState(
    () => ({
      year:
        initialHijri.year,
      month:
        initialHijri.month
    })
  );

  const gregorianDays =
    useMemo(
      () =>
        getGregorianDays(
          gregorianView.year(),
          gregorianView.month()
        ),
      [
        gregorianView
      ]
    );

  const hijriDays =
    useMemo(
      () =>
        getHijriMonthDays(
          hijriView.year,
          hijriView.month,
          hijriAdjustment
        ),
      [
        hijriView.year,
        hijriView.month,
        hijriAdjustment
      ]
    );

  const gregorianTitle =
    formatCalendarMonthTitle({
      monthName:
        ARABIC_MONTHS[
          gregorianView.month()
        ],
      monthNumber:
        gregorianView.month() +
        1,
      year:
        gregorianView.year(),
      era: 'م',
      numberStyle
    });

  const hijriTitle =
    formatCalendarMonthTitle({
      monthName:
        HIJRI_MONTHS[
          hijriView.month - 1
        ],
      monthNumber:
        hijriView.month,
      year:
        hijriView.year,
      era: 'هـ',
      numberStyle
    });

  const centerWeekdayText =
    ARABIC_WEEKDAYS[
      selectedDate.day()
    ];

  const centerGregorianText =
    `${formatAppNumber(
      selectedDate.format('DD'),
      numberStyle
    )} / ${ARABIC_MONTHS[
      selectedDate.month()
    ]} (${formatAppNumber(
      selectedDate.format('MM'),
      numberStyle
    )}) / ${formatAppNumber(
      selectedDate.format('YYYY'),
      numberStyle
    )}`;

  const selectedHijriParts =
    getHijriMonthForDate(
      selectedDate,
      hijriAdjustment
    );

  const centerHijriText =
    `${formatAppNumber(
      String(
        selectedHijriParts.day
      ).padStart(2, '0'),
      numberStyle
    )} / ${HIJRI_MONTHS[
      selectedHijriParts.month - 1
    ]} (${formatAppNumber(
      String(
        selectedHijriParts.month
      ).padStart(2, '0'),
      numberStyle
    )}) / ${formatAppNumber(
      selectedHijriParts.year,
      numberStyle
    )} هـ`;

  const syncViewsToDate =
    date => {
      const target =
        moment(date);

      setGregorianView(
        target
          .clone()
          .startOf(
            'month'
          )
      );

      const hijri =
        getHijriMonthForDate(
          target,
          hijriAdjustment
        );

      setHijriView({
        year:
          hijri.year,
        month:
          hijri.month
      });
    };

  /*
   * الانتقال التلقائي لليوم الجديد:
   *
   * - لو المستخدم كان واقف على "اليوم الفعلي" وقت دخول منتصف الليل،
   *   ننقله تلقائيًا لليوم الجديد ونزامن الميلادي والهجري والـSidebar.
   *
   * - لو المستخدم كان يتصفح تاريخًا قديمًا/مستقبليًا بنفسه،
   *   لا نسحبه فجأة إلى اليوم الحالي.
   */
  useEffect(() => {
    const previousToday =
      lastTodayRef.current;

    if (
      previousToday.isSame(
        today,
        'day'
      )
    ) {
      return;
    }

    const wasFollowingToday =
      selectedDate.isSame(
        previousToday,
        'day'
      );

    lastTodayRef.current =
      today.clone();

    if (
      !wasFollowingToday
    ) {
      return;
    }

    const next =
      today.clone();

    setSelectedDate(
      next
    );

    if (
      typeof onSelectedDateChange ===
      'function'
    ) {
      onSelectedDateChange(
        next.clone()
      );
    }

    syncViewsToDate(
      next
    );
  }, [
    today
  ]);

  const handleSelect =
    date => {
      if (!date) {
        return;
      }

      const next =
        moment(date);

      setSelectedDate(
        next.clone()
      );

      if (
        typeof onSelectedDateChange ===
        'function'
      ) {
        onSelectedDateChange(
          next.clone()
        );
      }

      syncViewsToDate(
        next
      );
    };

  const handleToday = () => {
    const now =
      moment();

    setSelectedDate(
      now.clone()
    );

    if (
      typeof onSelectedDateChange ===
      'function'
    ) {
      onSelectedDateChange(
        now.clone()
      );
    }

    syncViewsToDate(
      now
    );
  };

  const shiftHijriView =
    (
      current,
      amount
    ) => {
      let month =
        current.month +
        amount;

      let year =
        current.year;

      while (
        month < 1
      ) {
        month += 12;
        year -= 1;
      }

      while (
        month > 12
      ) {
        month -= 12;
        year += 1;
      }

      return {
        year,
        month
      };
    };

  const changeLinkedMonth =
    amount => {
      setGregorianView(
        current =>
          current
            .clone()
            .add(
              amount,
              'month'
            )
      );

      setHijriView(
        current =>
          shiftHijriView(
            current,
            amount
          )
      );
    };

  const changeLinkedYear =
    amount => {
      setGregorianView(
        current =>
          current
            .clone()
            .add(
              amount,
              'year'
            )
      );

      setHijriView(
        current => ({
          ...current,
          year:
            current.year +
            amount
        })
      );
    };

  const updateAdjustment =
    amount => {
      if (
        typeof
          setHijriAdjustment !==
        'function'
      ) {
        return;
      }

      setHijriAdjustment(
        value =>
          value +
          amount
      );
    };

  return (
    <div
      className="ui-calendar-page flex h-full flex-col p-4"
      style={{
        background:
          'var(--bg-primary)',
        color:
          'var(--text-primary)'
      }}
    >
      <div className="ui-calendar-top relative mb-3 flex h-[64px] shrink-0 items-center justify-center">
        <div
          className="absolute right-0 flex items-center gap-2 rounded-xl border px-3 py-2"
          style={{
            background:
              'var(--clock-bg)',
            borderColor:
              'var(--border)',
            color:
              'var(--text-primary)',
            boxShadow:
              'var(--shadow)'
          }}
          title="الوقت الحالي حسب نظام Windows"
        >
          <span
            className="text-[10px] font-extrabold"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            الوقت الحالي
          </span>

          <span
            dir="ltr"
            className="text-sm font-extrabold"
            style={{
              color:
                'var(--clock-text)'
            }}
          >
            {liveClockText}
          </span>
        </div>

        <button
          type="button"
          onClick={handleToday}
          title="العودة إلى اليوم الحالي"
          className="flex items-center justify-center rounded-xl border px-6 py-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background:
              'var(--date-header-bg)',
            borderColor:
              'var(--date-header-border)',
            color:
              'var(--date-header-text)',
            boxShadow:
              '0 4px 14px rgba(0,0,0,0.08)'
          }}
        >
          <span className="text-base font-extrabold">
            {centerWeekdayText}
          </span>

          <span className="mx-3 font-bold">
            |
          </span>

          <span className="text-base font-extrabold">
            {centerGregorianText}
          </span>

          {showHijri && (
            <>
              <span
                className="mx-3 font-extrabold"
                style={{
                  color:
                    'var(--text-muted)'
                }}
              >
                -
              </span>

              <span className="whitespace-nowrap text-base font-extrabold">
                {centerHijriText}
              </span>
            </>
          )}
        </button>

        <div className="absolute left-0 flex items-center gap-2">
          {showHijri && (
            <div
              className="flex items-center gap-1 rounded-xl border p-1"
              title="ضبط التاريخ الهجري"
              style={{
                background:
                  'var(--surface)',
                borderColor:
                  'var(--border)',
                boxShadow:
                  'var(--shadow)'
              }}
            >
              <button
                type="button"
                onClick={() =>
                  updateAdjustment(
                    -1
                  )
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg font-bold"
              >
                −
              </button>

              <button
                type="button"
                onClick={() =>
                  setHijriAdjustment?.(
                    0
                  )
                }
                className="flex h-7 min-w-[38px] items-center justify-center rounded-lg px-2 text-xs font-extrabold"
                style={{
                  background:
                    hijriAdjustment !==
                    0
                      ? 'var(--accent-soft)'
                      : 'transparent',
                  color:
                    hijriAdjustment !==
                    0
                      ? 'var(--accent)'
                      : 'var(--text-muted)'
                }}
              >
                {hijriAdjustment >
                0
                  ? `+${hijriAdjustment}`
                  : hijriAdjustment}
              </button>

              <button
                type="button"
                onClick={() =>
                  updateAdjustment(
                    1
                  )
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg font-bold"
              >
                +
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setShowHijri(
                value =>
                  !value
              )
            }
            className="flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-extrabold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                showHijri
                  ? 'var(--surface)'
                  : 'var(--accent-soft)',
              borderColor:
                showHijri
                  ? 'var(--border)'
                  : 'var(--accent)',
              color:
                showHijri
                  ? 'var(--text-secondary)'
                  : 'var(--accent)',
              boxShadow:
                'var(--shadow)'
            }}
            title={
              showHijri
                ? 'إخفاء التقويم الهجري'
                : 'إظهار التقويم الهجري'
            }
          >
            {showHijri ? (
              <EyeOff size={14} />
            ) : (
              <Eye size={14} />
            )}

            <span>
              {showHijri
                ? 'إخفاء الهجري'
                : 'إظهار الهجري'}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`ui-calendar-pair grid min-h-0 flex-1 gap-3 ${
          showHijri
            ? 'grid-cols-2'
            : 'grid-cols-1'
        }`}
      >
        {showHijri && (
          <>
                    <section
                      className="ui-calendar-card flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border"
                      style={{
                        /*
                         * في RTL أول عنصر Grid يظهر يمينًا.
                         * عند عكس الترتيب نرسل الهجري للمكان الثاني.
                         */
                        order:
                          reverseCalendarOrder
                            ? 2
                            : 1,
                        background:
                          'var(--surface)',
                        borderColor:
                          'var(--border)',
                        boxShadow:
                          'var(--shadow)'
                      }}
                    >
                      <CalendarHeader
                        title={
                          hijriTitle
                        }
                        subtitle="التقويم الهجري"
                        onPrevious={() =>
                          changeLinkedMonth(
                            -1
                          )
                        }
                        onNext={() =>
                          changeLinkedMonth(
                            1
                          )
                        }
                        onPreviousYear={() =>
                          changeLinkedYear(
                            -1
                          )
                        }
                        onNextYear={() =>
                          changeLinkedYear(
                            1
                          )
                        }
                      />

                      <div className="min-h-0 flex-1 p-2">
                        <HijriCalendarGrid
                          days={
                            hijriDays
                          }
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
                            handleSelect
                          }
                          onContextMenu={
                            onContextMenu
                          }
                        />
                      </div>
                    </section>
          </>
        )}

        <section
          className="ui-calendar-card flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border"
          style={{
            /*
             * false: الميلادي يسار (الوضع الحالي)
             * true : الميلادي يمين
             */
            order:
              reverseCalendarOrder
                ? 1
                : 2,
            background:
              'var(--calendar-card-bg)',
            /*
             * الإطار الخارجي للكارت يجب أن يتبع لون "الحدود"
             * من إعدادات الثيم، مثل كارت التقويم الهجري وباقي الواجهة.
             * calendarGridLine مخصص لخطوط الشبكة الداخلية فقط.
             */
            borderColor:
              'var(--border)',
            boxShadow:
              'var(--shadow)'
          }}
        >
          <CalendarHeader
            title={
              gregorianTitle
            }
            subtitle="التقويم الميلادي"
            onPrevious={() =>
              changeLinkedMonth(
                -1
              )
            }
            onNext={() =>
              changeLinkedMonth(
                1
              )
            }
            onPreviousYear={() =>
              changeLinkedYear(
                -1
              )
            }
            onNextYear={() =>
              changeLinkedYear(
                1
              )
            }
          />

          <div className="min-h-0 flex-1 p-2">
            <CalendarGrid
              days={
                gregorianDays
              }
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
                handleSelect
              }
              onContextMenu={
                onContextMenu
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}
