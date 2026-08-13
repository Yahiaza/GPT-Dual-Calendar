import {
  CalendarDays,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  X
} from 'lucide-react';

export default function Header({
  theme,
  onToggleTheme
}) {
  const minimizeWindow =
    () => {
      window.desktopAPI
        ?.minimizeWindow?.();
    };

  const hideWindow =
    () => {
      window.desktopAPI
        ?.hideWindow?.();
    };

  const toggleMaximize =
    () => {
      window.desktopAPI
        ?.toggleMaximize?.();
    };

  return (
    <header
      className="ui-header app-drag flex h-[54px] shrink-0 items-center justify-between border-b px-3"
      style={{
        background:
          'var(--topbar-bg)',
        borderColor:
          'var(--border)'
      }}
    >
      {/* اسم التطبيق */}

      <div className="flex items-center gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            background:
              'var(--accent-soft)',
            color:
              'var(--accent)'
          }}
        >
          <CalendarDays
            size={18}
          />
        </div>

        <div>
          <div className="text-sm font-extrabold">
            GPT Dual Calendar
          </div>

          <div
            className="text-[9px]"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            تقويم ميلادي وهجري
          </div>
        </div>
      </div>

      {/* أدوات التطبيق */}

      <div className="app-no-drag flex items-center gap-1">
        <button
          type="button"
          onClick={
            onToggleTheme
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          style={{
            color:
              'var(--text-secondary)'
          }}
          title="تغيير الثيم"
        >
          {theme ===
          'dark' ? (
            <Sun size={16} />
          ) : (
            <Moon size={16} />
          )}
        </button>

        <div
          className="mx-1 h-5 w-px"
          style={{
            background:
              'var(--border)'
          }}
        />

        <button
          type="button"
          onClick={
            minimizeWindow
          }
          className="flex h-8 w-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
          style={{
            color:
              'var(--text-secondary)'
          }}
          title="تصغير"
        >
          <Minimize2
            size={15}
          />
        </button>

        <button
          type="button"
          onClick={
            toggleMaximize
          }
          className="flex h-8 w-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
          style={{
            color:
              'var(--text-secondary)'
          }}
          title="تكبير / استعادة"
        >
          <Maximize2
            size={14}
          />
        </button>

        <button
          type="button"
          onClick={
            hideWindow
          }
          className="flex h-8 w-9 items-center justify-center rounded-lg transition-colors hover:bg-red-500 hover:text-white"
          style={{
            color:
              'var(--text-secondary)'
          }}
          title="إغلاق إلى شريط النظام"
        >
          <X size={17} />
        </button>
      </div>
    </header>
  );
}
