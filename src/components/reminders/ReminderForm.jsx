import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Bell,
  CalendarDays,
  FileText,
  Repeat,
  X
} from 'lucide-react';

import CustomDatePicker from '../common/CustomDatePicker';
import CustomTimePicker from '../common/CustomTimePicker';

import {
  RECURRENCE_TYPES,
  RECURRENCE_END_TYPES,
  createReminder,
  validateReminder
} from '../../services/reminderService';

import {
  formatAppNumber
} from '../../services/settingsService';

const recurrenceOptions = [
  [
    RECURRENCE_TYPES.NONE,
    'بدون تكرار'
  ],
  [
    RECURRENCE_TYPES.DAILY,
    'يومي'
  ],
  [
    RECURRENCE_TYPES.WEEKLY,
    'أسبوعي'
  ],
  [
    RECURRENCE_TYPES.MONTHLY,
    'شهري'
  ],
  [
    RECURRENCE_TYPES.YEARLY,
    'سنوي'
  ]
];

const endOptions = [
  [
    RECURRENCE_END_TYPES.NEVER,
    'دائمًا'
  ],
  [
    RECURRENCE_END_TYPES.DATE,
    'حتى تاريخ'
  ],
  [
    RECURRENCE_END_TYPES.COUNT,
    'بعد عدد مرات'
  ]
];

export default function ReminderForm({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  editingReminder = null,
  defaultTime = '09:00',
  numberStyle = 'western',
  timeFormat = '24'
}) {
  const timePickerRef =
    useRef(null);

  const [
    title,
    setTitle
  ] = useState('');

  const [
    notes,
    setNotes
  ] = useState('');

  const [
    date,
    setDate
  ] = useState('');

  const [
    time,
    setTime
  ] = useState(
    defaultTime
  );

  const [
    recurrenceType,
    setRecurrenceType
  ] = useState(
    RECURRENCE_TYPES.NONE
  );

  const [
    recurrenceInterval,
    setRecurrenceInterval
  ] = useState(1);

  const [
    recurrenceEndType,
    setRecurrenceEndType
  ] = useState(
    RECURRENCE_END_TYPES.NEVER
  );

  const [
    recurrenceEndDate,
    setRecurrenceEndDate
  ] = useState('');

  const [
    recurrenceCount,
    setRecurrenceCount
  ] = useState(5);

  const [
    errors,
    setErrors
  ] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (
      editingReminder
    ) {
      setTitle(
        editingReminder.title ||
        ''
      );

      setNotes(
        editingReminder.notes ||
        ''
      );

      setDate(
        editingReminder.date ||
        ''
      );

      setTime(
        editingReminder.time ||
        defaultTime
      );

      setRecurrenceType(
        editingReminder
          .recurrence?.type ||
        RECURRENCE_TYPES.NONE
      );

      setRecurrenceInterval(
        editingReminder
          .recurrence
          ?.interval || 1
      );

      setRecurrenceEndType(
        editingReminder
          .recurrence
          ?.endType ||
        RECURRENCE_END_TYPES.NEVER
      );

      setRecurrenceEndDate(
        editingReminder
          .recurrence
          ?.endDate || ''
      );

      setRecurrenceCount(
        editingReminder
          .recurrence
          ?.count || 5
      );
    } else {
      setTitle('');
      setNotes('');

      setDate(
        selectedDate
          ?.format
          ? selectedDate.format(
              'YYYY-MM-DD'
            )
          : ''
      );

      setTime(
        defaultTime
      );

      setRecurrenceType(
        RECURRENCE_TYPES.NONE
      );

      setRecurrenceInterval(
        1
      );

      setRecurrenceEndType(
        RECURRENCE_END_TYPES.NEVER
      );

      setRecurrenceEndDate(
        ''
      );

      setRecurrenceCount(
        5
      );
    }

    setErrors({});
  }, [
    isOpen,
    selectedDate,
    editingReminder,
    defaultTime
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape =
      event => {
        if (
          event.key ===
          'Escape'
        ) {
          onClose();
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
  }, [
    isOpen,
    onClose
  ]);

  if (!isOpen) {
    return null;
  }

  const submit =
    event => {
      event.preventDefault();

      const draft =
        createReminder({
          title,
          notes,
          date,
          time,
          recurrenceType,
          recurrenceInterval,
          recurrenceEndType,
          recurrenceEndDate:
            recurrenceEndType ===
            RECURRENCE_END_TYPES.DATE
              ? recurrenceEndDate
              : null,
          recurrenceCount:
            recurrenceEndType ===
            RECURRENCE_END_TYPES.COUNT
              ? recurrenceCount
              : null
        });

      const validation =
        validateReminder(
          draft
        );

      if (
        !validation.valid
      ) {
        setErrors(
          validation.errors
        );

        return;
      }

      if (
        editingReminder
      ) {
        onSave({
          ...editingReminder,
          title:
            draft.title,
          notes:
            draft.notes,
          date:
            draft.date,
          time:
            draft.time,
          recurrence:
            draft.recurrence,
          updatedAt:
            new Date()
              .toISOString()
        });
      } else {
        onSave(
          draft
        );
      }

      onClose();
    };

  const inputStyle = {
    background:
      'var(--bg-secondary)',
    color:
      'var(--text-primary)',
    borderColor:
      'var(--border)'
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={
        event => {
          if (
            event.target ===
            event.currentTarget
          ) {
            onClose();
          }
        }
      }
    >
      <div
        className="w-full max-w-[560px] overflow-visible rounded-2xl border shadow-2xl"
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
              <Bell size={19} />
            </div>

            <div>
              <div className="text-base font-bold">
                {editingReminder
                  ? 'تعديل التذكير'
                  : 'إضافة تذكير'}
              </div>

              <div
                className="mt-0.5 text-[11px]"
                style={{
                  color:
                    'var(--text-muted)'
                }}
              >
                اختر الوقت والتكرار المناسب
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 p-5"
        >
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold">
              <Bell size={14} />
              عنوان التذكير
            </label>

            <input
              autoFocus
              type="text"
              value={title}
              onChange={
                event =>
                  setTitle(
                    event.target.value
                  )
              }
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={
                inputStyle
              }
              placeholder="مثال: دفع الإيجار"
            />

            {errors.title && (
              <div className="mt-1 text-[11px] text-red-500">
                {errors.title}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold">
                <CalendarDays
                  size={14}
                />
                التاريخ
              </label>

              <CustomDatePicker
                value={date}
                onChange={
                  setDate
                }
                numberStyle={
                  numberStyle
                }
                onTabOut={() =>
                  timePickerRef.current
                    ?.focusHour()
                }
              />

              {errors.date && (
                <div className="mt-1 text-[11px] text-red-500">
                  {errors.date}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold">
                الوقت
              </label>

              <CustomTimePicker
                ref={
                  timePickerRef
                }
                value={time}
                onChange={
                  setTime
                }
                numberStyle={
                  numberStyle
                }
                timeFormat={
                  timeFormat
                }
              />

              {errors.time && (
                <div className="mt-1 text-[11px] text-red-500">
                  {errors.time}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold">
              <FileText size={14} />
              ملاحظات
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={
                event =>
                  setNotes(
                    event.target.value
                  )
              }
              className="w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={
                inputStyle
              }
            />
          </div>

          <div
            className="rounded-xl border p-4"
            style={{
              borderColor:
                'var(--border)',
              background:
                'var(--surface)'
            }}
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-bold">
              <Repeat size={15} />
              التكرار
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={
                  recurrenceType
                }
                onChange={
                  event =>
                    setRecurrenceType(
                      event.target.value
                    )
                }
                className="rounded-xl border px-3 py-2.5 text-sm"
                style={
                  inputStyle
                }
              >
                {recurrenceOptions.map(
                  item => (
                    <option
                      key={
                        item[0]
                      }
                      value={
                        item[0]
                      }
                    >
                      {item[1]}
                    </option>
                  )
                )}
              </select>

              {recurrenceType !==
                RECURRENCE_TYPES.NONE && (
                <div
                  className="flex items-center justify-between rounded-xl border px-3 py-2.5"
                  style={
                    inputStyle
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      setRecurrenceInterval(
                        current =>
                          Math.max(
                            1,
                            current - 1
                          )
                      )
                    }
                    className="h-6 w-6 rounded-md"
                    style={{
                      background:
                        'var(--surface-hover)'
                    }}
                  >
                    −
                  </button>

                  <span className="text-sm font-bold">
                    {formatAppNumber(
                      recurrenceInterval,
                      numberStyle
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setRecurrenceInterval(
                        current =>
                          current + 1
                      )
                    }
                    className="h-6 w-6 rounded-md"
                    style={{
                      background:
                        'var(--surface-hover)'
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {recurrenceType !==
              RECURRENCE_TYPES.NONE && (
              <div className="mt-3 space-y-3">
                <select
                  value={
                    recurrenceEndType
                  }
                  onChange={
                    event =>
                      setRecurrenceEndType(
                        event.target.value
                      )
                  }
                  className="w-full rounded-xl border px-3 py-2.5 text-sm"
                  style={
                    inputStyle
                  }
                >
                  {endOptions.map(
                    item => (
                      <option
                        key={
                          item[0]
                        }
                        value={
                          item[0]
                        }
                      >
                        {item[1]}
                      </option>
                    )
                  )}
                </select>

                {recurrenceEndType ===
                  RECURRENCE_END_TYPES.DATE && (
                  <CustomDatePicker
                    value={
                      recurrenceEndDate
                    }
                    onChange={
                      setRecurrenceEndDate
                    }
                    numberStyle={
                      numberStyle
                    }
                  />
                )}

                {recurrenceEndType ===
                  RECURRENCE_END_TYPES.COUNT && (
                  <div
                    className="flex items-center justify-between rounded-xl border px-3 py-2.5"
                    style={
                      inputStyle
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setRecurrenceCount(
                          current =>
                            Math.max(
                              1,
                              current - 1
                            )
                        )
                      }
                      className="h-7 w-7 rounded-lg"
                      style={{
                        background:
                          'var(--surface-hover)'
                      }}
                    >
                      −
                    </button>

                    <span className="text-sm font-extrabold">
                      {formatAppNumber(
                        recurrenceCount,
                        numberStyle
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setRecurrenceCount(
                          current =>
                            current + 1
                        )
                      }
                      className="h-7 w-7 rounded-lg"
                      style={{
                        background:
                          'var(--surface-hover)'
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className="flex justify-end gap-2 border-t pt-4"
            style={{
              borderColor:
                'var(--border)'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold"
              style={{
                background:
                  'var(--surface-hover)'
              }}
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="rounded-xl px-5 py-2 text-sm font-bold text-white"
              style={{
                background:
                  'var(--accent)'
              }}
            >
              {editingReminder
                ? 'حفظ التعديلات'
                : 'حفظ التذكير'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
