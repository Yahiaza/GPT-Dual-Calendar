import {
  Trash2,
  X
} from 'lucide-react';

export default function DeleteReminderModal({
  isOpen,
  occurrence,
  onClose,
  onDeleteSingle,
  onDeleteFollowing,
  onDeleteSeries
}) {
  if (
    !isOpen ||
    !occurrence
  ) {
    return null;
  }

  const recurring =
    occurrence.source
      ?.recurrence
      ?.type !==
    'none';

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-[440px] overflow-hidden rounded-2xl border shadow-2xl"
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
          <div className="flex items-center gap-2 font-bold">
            <Trash2
              size={18}
              style={{
                color:
                  'var(--danger)'
              }}
            />

            حذف التذكير
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 p-5">
          <button
            type="button"
            onClick={() =>
              onDeleteSingle(
                occurrence
              )
            }
            className="w-full rounded-xl border px-4 py-3 text-right text-sm font-semibold"
            style={{
              borderColor:
                'var(--border)'
            }}
          >
            حذف هذا التذكير فقط
          </button>

          {recurring && (
            <>
              <button
                type="button"
                onClick={() =>
                  onDeleteFollowing(
                    occurrence
                  )
                }
                className="w-full rounded-xl border px-4 py-3 text-right text-sm font-semibold"
                style={{
                  borderColor:
                    'var(--border)'
                }}
              >
                حذف هذا وما بعده
              </button>

              <button
                type="button"
                onClick={() =>
                  onDeleteSeries(
                    occurrence
                  )
                }
                className="w-full rounded-xl px-4 py-3 text-right text-sm font-bold"
                style={{
                  background:
                    'var(--danger-soft)',
                  color:
                    'var(--danger)'
                }}
              >
                حذف السلسلة بالكامل
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
