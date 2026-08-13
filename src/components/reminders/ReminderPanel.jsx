import {
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  ListChecks,
  Plus,
  Printer,
  RotateCcw,
  Trash2
} from 'lucide-react';

import moment from 'moment';

import {
  formatHijriDate
} from '../../services/hijriService';

import {
  getRemindersForDate,
  getRemindersForRange,
  printMonthRemindersDocument
} from '../../services/reminderService';

import {
  useMemo,
  useState
} from 'react';

function makeCompletedMap(
  completed = []
) {
  return new Map(
    completed.map(
      item => [
        item.occurrenceId,
        item
      ]
    )
  );
}

function groupMonthItems(
  items = []
) {
  const groups =
    new Map();

  for (
    const item of items
  ) {
    const source =
      item.source || {};

    const recurring =
      source.recurrence?.type &&
      source.recurrence.type !==
        'none';

    const key =
      recurring
        ? `series:${source.seriesId || source.id}`
        : `single:${item.occurrenceId}`;

    if (
      !groups.has(key)
    ) {
      groups.set(
        key,
        {
          key,
          title:
            item.title,
          recurring,
          recurrenceType:
            source.recurrence
              ?.type || 'none',
          items: []
        }
      );
    }

    groups.get(
      key
    ).items.push(
      item
    );
  }

  return Array.from(
    groups.values()
  );
}

const recurrenceNames = {
  daily: 'يومي',
  weekly: 'أسبوعي',
  monthly: 'شهري',
  yearly: 'سنوي',
  none: 'مرة واحدة'
};

export default function ReminderPanel({
  selectedDate,
  reminders = [],
  exceptions = [],
  completed = [],
  hijriAdjustment = 0,
  onAddReminder,
  onOpenReminder,
  onCompleteReminder,
  onRestoreCompleted,
  onRequestDelete,
  onPrintReminder
}) {
  const [
    activeTab,
    setActiveTab
  ] = useState('day');

  const [
    expandedGroups,
    setExpandedGroups
  ] = useState({});

  const [
    contextMenu,
    setContextMenu
  ] = useState(null);

  const safeDate =
    selectedDate &&
    typeof selectedDate.format ===
      'function'
      ? selectedDate
      : moment();

  const completedMap =
    useMemo(
      () =>
        makeCompletedMap(
          completed
        ),
      [
        completed
      ]
    );

  const dayItems =
    useMemo(
      () =>
        getRemindersForDate(
          reminders,
          safeDate,
          exceptions
        ),
      [
        reminders,
        safeDate,
        exceptions
      ]
    );

  const actualMonthStart =
    useMemo(
      () =>
        moment()
          .startOf(
            'month'
          ),
      []
    );

  const actualMonthEnd =
    useMemo(
      () =>
        moment()
          .endOf(
            'month'
          ),
      []
    );

  const monthAllItems =
    useMemo(
      () =>
        getRemindersForRange(
          reminders,
          actualMonthStart,
          actualMonthEnd,
          []
        ),
      [
        reminders,
        actualMonthStart,
        actualMonthEnd
      ]
    );

  const monthGroups =
    useMemo(
      () =>
        groupMonthItems(
          monthAllItems
        ),
      [
        monthAllItems
      ]
    );

  const tabs = [
    {
      id: 'day',
      label: 'اليوم',
      count:
        dayItems.length,
      icon: Bell
    },
    {
      id: 'month',
      label: 'الشهر',
      count:
        monthAllItems.length,
      icon: ListChecks
    },
    {
      id: 'done',
      label: 'تم',
      count:
        completed.length,
      icon: CheckCircle2
    }
  ];

  const toggleGroup =
    key => {
      setExpandedGroups(
        current => ({
          ...current,
          [key]:
            !current[key]
        })
      );
    };

  const openContextMenu =
    (
      event,
      item
    ) => {
      event.preventDefault();
      event.stopPropagation();

      setContextMenu({
        x:
          event.clientX,
        y:
          event.clientY,
        item
      });
    };

  return (
    <aside
      className="ui-reminder-panel relative flex w-[280px] shrink-0 flex-col border-l p-3"
      style={{
        background:
          'var(--reminder-panel-bg)',
        borderColor:
          'var(--border)'
      }}
      onClick={() =>
        setContextMenu(
          null
        )
      }
    >
      <div
        className="rounded-2xl border p-3"
        style={{
          background:
            'var(--surface)',
          borderColor:
            'var(--border)'
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="flex items-center gap-2 text-[10px] font-semibold"
              style={{
                color:
                  'var(--text-muted)'
              }}
            >
              <CalendarDays
                size={13}
                style={{
                  color:
                    'var(--accent)'
                }}
              />
              اليوم المحدد
            </div>

            <div
              className="mt-1 text-sm font-extrabold"
              style={{
                color:
                  'var(--accent)'
              }}
            >
              {safeDate.format(
                'YYYY/MM/DD'
              )}
            </div>

            <div
              className="mt-1 text-[11px] font-semibold"
              style={{
                color:
                  'var(--text-secondary)'
              }}
            >
              {formatHijriDate(
                safeDate,
                hijriAdjustment
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onAddReminder(
                safeDate.clone()
              )
            }
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-white"
            style={{
              background:
                'var(--accent)'
            }}
          >
            <Plus size={15} />
            إضافة
          </button>
        </div>
      </div>

      <div
        className="mt-3 grid grid-cols-3 gap-1 rounded-xl p-1"
        style={{
          background:
            'var(--surface-hover)'
        }}
      >
        {tabs.map(
          tab => {
            const Icon =
              tab.icon;

            const active =
              activeTab ===
              tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(
                    tab.id
                  )
                }
                className="flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-[10px] font-bold"
                style={{
                  background:
                    active
                      ? 'var(--surface)'
                      : 'transparent',
                  color:
                    active
                      ? 'var(--accent)'
                      : 'var(--text-muted)'
                }}
              >
                <Icon size={12} />
                {tab.label}
                <span>
                  {tab.count}
                </span>
              </button>
            );
          }
        )}
      </div>

      <div
        className="mt-3 flex items-center justify-between border-b pb-2"
        style={{
          borderColor:
            'var(--border)'
        }}
      >
        <div className="text-xs font-bold">
          {activeTab ===
          'day'
            ? 'تذكيرات اليوم المحدد'
            : activeTab ===
                'month'
              ? `تذكيرات ${moment().format('MMMM YYYY')}`
              : 'التذكيرات المكتملة'}
        </div>

        {activeTab ===
          'month' && (
          <button
            type="button"
            onClick={() =>
              printMonthRemindersDocument(
                monthAllItems,
                `تذكيرات ${moment().format('MMMM YYYY')}`
              )
            }
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-bold"
            style={{
              background:
                'var(--accent-soft)',
              color:
                'var(--accent)'
            }}
          >
            <Printer size={11} />
            طباعة الشهر
          </button>
        )}
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
        {activeTab ===
        'month' ? (
          monthGroups.length ===
          0 ? (
            <div
              className="flex h-full min-h-[130px] items-center justify-center rounded-2xl px-4 text-center text-[11px]"
              style={{
                background:
                  'var(--surface-hover)',
                color:
                  'var(--text-muted)'
              }}
            >
              لا توجد تذكيرات في الشهر الحالي
            </div>
          ) : (
            <div className="space-y-2">
              {monthGroups.map(
                group => {
                  const expanded =
                    Boolean(
                      expandedGroups[
                        group.key
                      ]
                    );

                  const doneCount =
                    group.items.filter(
                      item =>
                        completedMap.has(
                          item.occurrenceId
                        )
                    ).length;

                  return (
                    <div
                      key={
                        group.key
                      }
                      className="overflow-hidden rounded-xl border"
                      style={{
                        background:
                          'var(--surface)',
                        borderColor:
                          'var(--border)'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleGroup(
                            group.key
                          )
                        }
                        className="flex w-full items-center justify-between gap-2 p-3 text-right"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-xs font-bold">
                            {group.title}
                          </div>

                          <div
                            className="mt-1 text-[9px]"
                            style={{
                              color:
                                'var(--text-muted)'
                            }}
                          >
                            {
                              recurrenceNames[
                                group.recurrenceType
                              ]
                            }
                            {' • '}
                            {
                              group.items.length
                            }
                            {' '}
                            موعد
                            {doneCount > 0
                              ? ` • تم ${doneCount}`
                              : ''}
                          </div>
                        </div>

                        {expanded ? (
                          <ChevronUp
                            size={14}
                          />
                        ) : (
                          <ChevronDown
                            size={14}
                          />
                        )}
                      </button>

                      {expanded && (
                        <div
                          className="space-y-1 border-t p-2"
                          style={{
                            borderColor:
                              'var(--border)'
                          }}
                        >
                          {group.items.map(
                            item => {
                              const done =
                                completedMap.has(
                                  item.occurrenceId
                                );

                              return (
                                <div
                                  key={
                                    item.occurrenceId
                                  }
                                  onContextMenu={
                                    event =>
                                      openContextMenu(
                                        event,
                                        item
                                      )
                                  }
                                  className="flex items-center gap-2 rounded-lg px-2 py-2"
                                  style={{
                                    background:
                                      'var(--bg-secondary)'
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onOpenReminder(
                                        item
                                      )
                                    }
                                    className="min-w-0 flex-1 text-right"
                                  >
                                    <div
                                      className="truncate text-[10px] font-semibold"
                                      style={{
                                        textDecoration:
                                          done
                                            ? 'line-through'
                                            : 'none',
                                        color:
                                          done
                                            ? 'var(--text-muted)'
                                            : 'var(--text-primary)'
                                      }}
                                    >
                                      {item.date}
                                      {' • '}
                                      {item.time}
                                    </div>
                                  </button>

                                  {done ? (
                                    <span
                                      className="flex shrink-0 items-center gap-1 text-[9px] font-bold"
                                      style={{
                                        color:
                                          'var(--accent)'
                                      }}
                                    >
                                      <CheckCircle2
                                        size={12}
                                      />
                                      تم
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onCompleteReminder(
                                          item
                                        )
                                      }
                                      className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-bold text-white"
                                      style={{
                                        background:
                                          'var(--accent)'
                                      }}
                                    >
                                      <Check
                                        size={10}
                                      />
                                      تم
                                    </button>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )
        ) : activeTab ===
          'done' ? (
          completed.length ===
          0 ? (
            <div
              className="flex h-full min-h-[130px] items-center justify-center rounded-2xl px-4 text-center text-[11px]"
              style={{
                background:
                  'var(--surface-hover)',
                color:
                  'var(--text-muted)'
              }}
            >
              لا توجد تذكيرات مكتملة
            </div>
          ) : (
            <div className="space-y-2">
              {completed.map(
                item => (
                  <div
                    key={
                      item.occurrenceId
                    }
                    className="rounded-xl border p-2.5"
                    style={{
                      background:
                        'var(--surface)',
                      borderColor:
                        'var(--border)'
                    }}
                  >
                    <div
                      className="truncate text-xs font-bold"
                      style={{
                        textDecoration:
                          'line-through',
                        color:
                          'var(--text-muted)'
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      className="mt-1 flex items-center gap-1.5 text-[9px]"
                      style={{
                        color:
                          'var(--text-muted)'
                      }}
                    >
                      <Clock size={10} />
                      {item.date}
                      <span>•</span>
                      {item.time}
                    </div>

                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          onRestoreCompleted(
                            item
                          )
                        }
                        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[9px] font-bold"
                        style={{
                          color:
                            'var(--text-secondary)',
                          background:
                            'var(--surface-hover)'
                        }}
                      >
                        <RotateCcw
                          size={11}
                        />
                        استرجاع
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )
        ) : dayItems.length ===
          0 ? (
            <div
              className="flex h-full min-h-[130px] items-center justify-center rounded-2xl px-4 text-center text-[11px]"
              style={{
                background:
                  'var(--surface-hover)',
                color:
                  'var(--text-muted)'
              }}
            >
              لا توجد تذكيرات لهذا اليوم
            </div>
          ) : (
            <div className="space-y-2">
              {dayItems.map(
                item => (
                  <div
                    key={
                      item.occurrenceId
                    }
                    onContextMenu={
                      event =>
                        openContextMenu(
                          event,
                          item
                        )
                    }
                    className="rounded-xl border p-2.5"
                    style={{
                      background:
                        'var(--surface)',
                      borderColor:
                        'var(--border)'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onOpenReminder(
                          item
                        )
                      }
                      className="w-full text-right"
                    >
                      <div className="truncate text-xs font-bold">
                        {item.title}
                      </div>

                      <div
                        className="mt-1 flex items-center gap-1.5 text-[9px]"
                        style={{
                          color:
                            'var(--text-muted)'
                        }}
                      >
                        <Clock size={10} />
                        {item.time}
                      </div>
                    </button>

                    <div
                      className="mt-2 flex justify-end border-t pt-2"
                      style={{
                        borderColor:
                          'var(--border)'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onCompleteReminder(
                            item
                          )
                        }
                        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[9px] font-bold text-white"
                        style={{
                          background:
                            'var(--accent)'
                        }}
                      >
                        <Check
                          size={11}
                        />
                        تم
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </div>

      {contextMenu && (
        <div
          className="fixed z-[300] w-[190px] rounded-xl border p-1 shadow-2xl"
          style={{
            left:
              contextMenu.x,
            top:
              contextMenu.y,
            background:
              'var(--bg-secondary)',
            borderColor:
              'var(--border)'
          }}
          onClick={
            event =>
              event.stopPropagation()
          }
        >
          <button
            type="button"
            onClick={() => {
              onOpenReminder(
                contextMenu.item
              );

              setContextMenu(
                null
              );
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs"
          >
            <Eye size={14} />
            استعراض التذكير
          </button>

          <button
            type="button"
            onClick={() => {
              onPrintReminder(
                contextMenu.item
              );

              setContextMenu(
                null
              );
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs"
          >
            <Printer size={14} />
            طباعة التذكير
          </button>

          <button
            type="button"
            onClick={() => {
              onRequestDelete(
                contextMenu.item
              );

              setContextMenu(
                null
              );
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-xs"
            style={{
              color:
                'var(--danger)'
            }}
          >
            <Trash2 size={14} />
            حذف التذكير
          </button>
        </div>
      )}
    </aside>
  );
}
