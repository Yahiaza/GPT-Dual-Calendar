import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

export default function CalendarHeader({
  title,
  subtitle,
  onPrevious,
  onNext,
  onPreviousYear,
  onNextYear
}) {
  const buttonClass =
    'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:scale-105';

  return (
    <div
      className="ui-calendar-header flex items-center justify-between border-b px-4 py-3"
      style={{
        borderColor:
          'var(--calendar-grid-line)'
      }}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={
            onPreviousYear
          }
          title="السنة السابقة"
          className={
            buttonClass
          }
          style={{
            color:
              'var(--text-secondary)'
          }}
        >
          <ChevronsRight
            size={18}
          />
        </button>

        <button
          type="button"
          onClick={onPrevious}
          title="الشهر السابق"
          className={
            buttonClass
          }
          style={{
            color:
              'var(--text-secondary)'
          }}
        >
          <ChevronRight
            size={18}
          />
        </button>
      </div>

      <div className="min-w-[140px] text-center">
        <div
          className="text-[16px] font-bold"
          style={{
            color:
              'var(--calendar-month-text)'
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            className="mt-1 text-[12px] font-extrabold"
            style={{
              color:
                'var(--calendar-subtitle-text)'
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onNext}
          title="الشهر التالي"
          className={
            buttonClass
          }
          style={{
            color:
              'var(--text-secondary)'
          }}
        >
          <ChevronLeft
            size={18}
          />
        </button>

        <button
          type="button"
          onClick={onNextYear}
          title="السنة التالية"
          className={
            buttonClass
          }
          style={{
            color:
              'var(--text-secondary)'
          }}
        >
          <ChevronsLeft
            size={18}
          />
        </button>
      </div>
    </div>
  );
}
