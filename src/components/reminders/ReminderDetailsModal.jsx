import {
  Bell,
  CalendarDays,
  Clock,
  Edit3,
  FileText,
  Repeat,
  Trash2,
  X
} from 'lucide-react';

const recurrenceLabels = {
  none: 'بدون تكرار',
  daily: 'يومي',
  weekly: 'أسبوعي',
  monthly: 'شهري',
  yearly: 'سنوي'
};

export default function ReminderDetailsModal({
  isOpen,
  occurrence,
  onClose,
  onEdit,
  onDelete
}) {
  if (
    !isOpen ||
    !occurrence
  ) {
    return null;
  }

  const source =
    occurrence.source;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-[470px] overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          background:
            'var(--bg-primary)',
          borderColor:
            'var(--border)'
        }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{
            borderColor:
              'var(--border)'
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background:
                  'var(--accent-soft)',
                color:
                  'var(--accent)'
              }}
            >
              <Bell size={18} />
            </div>

            <div>
              <div className="text-base font-extrabold">
                {occurrence.title}
              </div>

              <div
                className="text-[10px]"
                style={{
                  color:
                    'var(--text-muted)'
                }}
              >
                تفاصيل التذكير
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-center gap-3 text-sm">
            <CalendarDays
              size={16}
              style={{
                color:
                  'var(--accent)'
              }}
            />

            {occurrence.date}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock
              size={16}
              style={{
                color:
                  'var(--accent)'
              }}
            />

            {occurrence.time}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Repeat
              size={16}
              style={{
                color:
                  'var(--accent)'
              }}
            />

            {
              recurrenceLabels[
                source
                  ?.recurrence
                  ?.type
              ] ||
              'بدون تكرار'
            }
          </div>

          {occurrence.notes && (
            <div
              className="rounded-xl border p-3 text-sm"
              style={{
                borderColor:
                  'var(--border)',
                background:
                  'var(--surface)'
              }}
            >
              <div className="mb-2 flex items-center gap-2 text-xs font-bold">
                <FileText size={14} />
                ملاحظات
              </div>

              {occurrence.notes}
            </div>
          )}
        </div>

        <div
          className="flex justify-between border-t p-4"
          style={{
            borderColor:
              'var(--border)'
          }}
        >
          <button
            type="button"
            onClick={() =>
              onDelete(
                occurrence
              )
            }
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold"
            style={{
              background:
                'var(--danger-soft)',
              color:
                'var(--danger)'
            }}
          >
            <Trash2 size={14} />
            حذف
          </button>

          <button
            type="button"
            onClick={() =>
              onEdit(
                source
              )
            }
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white"
            style={{
              background:
                'var(--accent)'
            }}
          >
            <Edit3 size={14} />
            تعديل
          </button>
        </div>
      </div>
    </div>
  );
}
