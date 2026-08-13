import {
  ArrowLeftRight,
  CalendarDays,
  Calculator,
  LogOut,
  Settings
} from 'lucide-react';

const items = [
  {
    id: 'calendar',
    label: 'التقويم',
    icon: CalendarDays
  },
  {
    id: 'converter',
    label: 'تحويل التاريخ',
    icon: ArrowLeftRight
  },
  {
    id: 'difference',
    label: 'فرق التاريخين',
    icon: Calculator
  }
];

export default function Sidebar({
  activeView,
  onViewChange
}) {
  return (
    <aside
      className="ui-sidebar flex w-[160px] shrink-0 flex-col border-l p-3"
      style={{
        background:
          'var(--sidebar-bg)',
        borderColor:
          'var(--border)'
      }}
    >
      <div
        className="mb-2 px-2 text-[10px] font-semibold"
        style={{
          color:
            'var(--text-muted)'
        }}
      >
        التنقل
      </div>

      <nav className="space-y-1">
        {items.map(
          item => {
            const Icon =
              item.icon;

            const active =
              activeView ===
              item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onViewChange(
                    item.id
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-xs font-semibold transition-all"
                style={{
                  background:
                    active
                      ? 'var(--accent-soft)'
                      : 'transparent',
                  color:
                    active
                      ? 'var(--accent)'
                      : 'var(--text-secondary)'
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          }
        )}
      </nav>

      <div className="mt-auto space-y-1">
        <button
          type="button"
          onClick={() =>
            onViewChange(
              'settings'
            )
          }
          className="ui-sidebar-settings flex w-full items-center gap-2 rounded-xl px-3 py-2 text-right text-[10px] font-semibold transition-all"
          style={{
            background:
              activeView ===
              'settings'
                ? 'var(--accent-soft)'
                : 'transparent',
            color:
              activeView ===
              'settings'
                ? 'var(--accent)'
                : 'var(--text-muted)'
          }}
        >
          <Settings size={14} />
          الإعدادات
        </button>

        <button
          type="button"
          onClick={() =>
            window.desktopAPI
              ?.quitApp?.()
          }
          className="ui-sidebar-exit flex w-full items-center gap-2 rounded-xl px-3 py-2 text-right text-[10px] font-bold transition-all"
          style={{
            background:
              'var(--danger-soft)',
            color:
              'var(--danger)'
          }}
          title="خروج نهائي"
        >
          <LogOut size={14} />
          خروج
        </button>
      </div>
    </aside>
  );
}
