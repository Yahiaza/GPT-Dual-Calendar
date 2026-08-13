import {
  useEffect,
  useState
} from 'react';

import {
  Bell,
  Eye,
  Trash2
} from 'lucide-react';

import moment from 'moment';

import Header from './Header';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';

import Calendar from '../calendar/Calendar';

import ReminderPanel from '../reminders/ReminderPanel';
import ReminderForm from '../reminders/ReminderForm';
import ReminderDetailsModal from '../reminders/ReminderDetailsModal';
import DeleteReminderModal from '../reminders/DeleteReminderModal';

import DateDifferenceView from '../difference/DateDifferenceView';
import DateConverterView from '../difference/DateConverterView';
import SettingsView from '../settings/SettingsView';

import {
  DEFAULT_SETTINGS,
  applyColorSettings,
  loadSettings,
  saveSettings
} from '../../services/settingsService';

import {
  completeReminderOccurrence,
  deleteReminderById,
  deleteReminderSeries,
  deleteThisAndFollowing,
  deleteThisOccurrence,
  getRemindersForDate,
  loadCompletedReminders,
  loadReminderExceptions,
  loadReminders,
  restoreCompletedOccurrence,
  saveCompletedReminders,
  saveReminderExceptions,
  saveReminders,
  printReminderDocument
} from '../../services/reminderService';

export default function AppLayout({
  theme,
  onToggleTheme
}) {
  const [
    activeView,
    setActiveView
  ] = useState(
    'calendar'
  );

  const [
    settings,
    setSettings
  ] = useState(
    () => loadSettings()
  );

  const [
    hijriAdjustment,
    setHijriAdjustment
  ] = useState(
    () =>
      Number(
        loadSettings()
          .hijriAdjustment ||
        0
      )
  );

  const [
    selectedDate,
    setSelectedDate
  ] = useState(
    () => moment()
  );

  const [
    contextMenu,
    setContextMenu
  ] = useState(null);

  const [
    reminderFormOpen,
    setReminderFormOpen
  ] = useState(false);

  const [
    reminderDate,
    setReminderDate
  ] = useState(null);

  const [
    editingReminder,
    setEditingReminder
  ] = useState(null);

  const [
    reminders,
    setReminders
  ] = useState(
    () => loadReminders()
  );

  const [
    exceptions,
    setExceptions
  ] = useState(
    () =>
      loadReminderExceptions()
  );

  const [
    completed,
    setCompleted
  ] = useState(
    () =>
      loadCompletedReminders()
  );

  const [
    selectedOccurrence,
    setSelectedOccurrence
  ] = useState(null);

  const [
    deleteOccurrence,
    setDeleteOccurrence
  ] = useState(null);

  useEffect(() => {
    applyColorSettings(
      settings,
      theme
    );

    document.documentElement.dataset.uiStyle =
      settings.visualStyle ||
      'classic';
  }, [
    settings,
    theme
  ]);

  useEffect(() => {
    saveSettings(
      settings
    );

    if (
      window.desktopAPI
        ?.setCloseBehavior
    ) {
      window.desktopAPI
        .setCloseBehavior(
          settings.closeBehavior
        );
    }

    if (
      Number(
        settings.hijriAdjustment
      ) !==
      Number(
        hijriAdjustment
      )
    ) {
      setHijriAdjustment(
        Number(
          settings.hijriAdjustment ||
          0
        )
      );
    }
  }, [settings]);

  useEffect(() => {
    saveReminders(
      reminders
    );
  }, [reminders]);

  useEffect(() => {
    saveReminderExceptions(
      exceptions
    );
  }, [exceptions]);

  useEffect(() => {
    saveCompletedReminders(
      completed
    );
  }, [completed]);

  useEffect(() => {
    const handleGlobalEscape =
      event => {
        if (
          event.key !==
          'Escape'
        ) {
          return;
        }

        if (
          deleteOccurrence
        ) {
          setDeleteOccurrence(
            null
          );
          return;
        }

        if (
          selectedOccurrence
        ) {
          setSelectedOccurrence(
            null
          );
          return;
        }

        if (
          contextMenu
        ) {
          setContextMenu(
            null
          );
          return;
        }

        if (
          reminderFormOpen
        ) {
          setReminderFormOpen(
            false
          );
          setReminderDate(
            null
          );
          setEditingReminder(
            null
          );
        }
      };

    window.addEventListener(
      'keydown',
      handleGlobalEscape
    );
  return () =>
      window.removeEventListener(
        'keydown',
        handleGlobalEscape
      );
  }, [
    contextMenu,
    deleteOccurrence,
    reminderFormOpen,
    selectedOccurrence
  ]);

  /*
   * إشعارات Windows
   */
  useEffect(() => {
    if (
      !settings.notificationsEnabled ||
      !window.desktopAPI
        ?.showNotification
    ) {
      return;
    }

    const timer =
      setInterval(
        () => {
          const now =
            moment();

          const targetTime =
            now
              .clone()
              .add(
                Number(
                  settings.notificationLeadMinutes ||
                  0
                ),
                'minutes'
              );

          const date =
            targetTime.format(
              'YYYY-MM-DD'
            );

          const time =
            targetTime.format(
              'HH:mm'
            );

          const due =
            getRemindersForDate(
              reminders,
              date,
              exceptions
            ).filter(
              item =>
                item.time ===
                time
            );

          due.forEach(
            item => {
              const key =
                `notified_${item.occurrenceId}_${time}`;

              if (
                sessionStorage.getItem(
                  key
                )
              ) {
                return;
              }

              sessionStorage.setItem(
                key,
                '1'
              );

              window.desktopAPI
                .showNotification({
                  title:
                    item.title,
                  body:
                    item.notes ||
                    'لديك تذكير الآن'
                });
            }
          );
        },
        30000
      );

    return () =>
      clearInterval(
        timer
      );
  }, [
    reminders,
    exceptions,
    settings.notificationsEnabled,
    settings.notificationLeadMinutes
  ]);

  const handleContextMenu =
    (
      event,
      date
    ) => {
      event.preventDefault();

      setSelectedDate(
        date.clone()
      );

      setContextMenu({
        x:
          event.clientX,
        y:
          event.clientY,
        date:
          date.clone()
      });
    };

  const openAddReminder =
    date => {
      const target =
        date?.clone
          ? date.clone()
          : selectedDate.clone();

      setEditingReminder(
        null
      );

      setReminderDate(
        target
      );

      setReminderFormOpen(
        true
      );

      setContextMenu(
        null
      );
    };

  const saveReminder =
    reminder => {
      setReminders(
        current => {
          const exists =
            current.some(
              item =>
                item.id ===
                reminder.id
            );

          if (
            exists
          ) {
            return current.map(
              item =>
                item.id ===
                reminder.id
                  ? reminder
                  : item
            );
          }

          return [
            ...current,
            reminder
          ];
        }
      );
    };

  const openDetails =
    occurrence => {
      setSelectedOccurrence(
        occurrence
      );
    };

  const editReminder =
    reminder => {
      setSelectedOccurrence(
        null
      );

      setEditingReminder(
        reminder
      );

      setReminderDate(
        null
      );

      setReminderFormOpen(
        true
      );
    };

  const requestDelete =
    occurrence => {
      setSelectedOccurrence(
        null
      );

      setDeleteOccurrence(
        occurrence
      );
    };

  const deleteSingle =
    occurrence => {
      const recurring =
        occurrence.source
          ?.recurrence
          ?.type !==
        'none';

      if (
        recurring
      ) {
        setExceptions(
          current =>
            deleteThisOccurrence(
              occurrence.occurrenceId,
              current
            )
        );
      } else {
        setReminders(
          current =>
            deleteReminderById(
              current,
              occurrence.reminderId
            )
        );
      }

      setDeleteOccurrence(
        null
      );
    };

  const deleteFollowing =
    occurrence => {
      setReminders(
        current =>
          deleteThisAndFollowing(
            current,
            occurrence.reminderId,
            occurrence.date
          )
      );

      setDeleteOccurrence(
        null
      );
    };

  const deleteSeries =
    occurrence => {
      setReminders(
        current =>
          deleteReminderSeries(
            current,
            occurrence.seriesId
          )
      );

      setDeleteOccurrence(
        null
      );
    };

  const completeOccurrence =
    occurrence => {
      setCompleted(
        current =>
          completeReminderOccurrence(
            current,
            occurrence
          )
      );

      setExceptions(
        current =>
          deleteThisOccurrence(
            occurrence.occurrenceId,
            current
          )
      );

      setSelectedOccurrence(
        null
      );
    };

  const restoreCompleted =
    item => {
      setCompleted(
        current =>
          restoreCompletedOccurrence(
            current,
            item.occurrenceId
          )
      );

      setExceptions(
        current =>
          current.filter(
            id =>
              id !==
              item.occurrenceId
          )
      );
    };

  /*
   * التذكيرات الخاصة باليوم المفتوح في قائمة Right Click.
   * لازم تكون الدالة داخل نطاق الـ component،
   * وليس داخل useEffect، حتى تكون متاحة أثناء render.
   */
  const getContextDayItems =
    () => {
      if (
        !contextMenu?.date
      ) {
        return [];
      }

      return getRemindersForDate(
        reminders,
        contextMenu.date,
        exceptions
      );
    };

  return (
    <div
      dir="rtl"
      className={`app-shell ui-style-${settings.visualStyle || 'classic'} relative flex h-screen w-screen flex-col overflow-hidden`}
      style={{
        background:
          'var(--bg-primary)',
        color:
          'var(--text-primary)'
      }}
      onClick={() =>
        setContextMenu(
          null
        )
      }
    >
      <Header
        theme={theme}
        onToggleTheme={
          onToggleTheme
        }
      />

      <div className="ui-body flex min-h-0 flex-1">
        <Sidebar
          activeView={
            activeView
          }
          onViewChange={
            view => {
              setActiveView(
                view
              );

              setContextMenu(
                null
              );
            }
          }
        />

        {/* لوحة التذكيرات ثابتة بجانب المحتوى */}
        <ReminderPanel
          selectedDate={
            selectedDate
          }
          reminders={
            reminders
          }
          exceptions={
            exceptions
          }
          completed={
            completed
          }
          hijriAdjustment={
            hijriAdjustment
          }
          onAddReminder={
            openAddReminder
          }
          onOpenReminder={
            openDetails
          }
          onCompleteReminder={
            completeOccurrence
          }
          onRestoreCompleted={
            restoreCompleted
          }
          onRequestDelete={
            requestDelete
          }
          onPrintReminder={
            printReminderDocument
          }
        />

        <main className="ui-main relative min-w-[700px] flex-1 overflow-hidden">
          {activeView ===
            'calendar' && (
            <Calendar
              onContextMenu={
                handleContextMenu
              }
              hijriAdjustment={
                hijriAdjustment
              }
              setHijriAdjustment={
                valueOrUpdater => {
                  setHijriAdjustment(
                    current => {
                      const next =
                        typeof valueOrUpdater ===
                        'function'
                          ? valueOrUpdater(
                              current
                            )
                          : valueOrUpdater;

                      setSettings(
                        currentSettings => ({
                          ...currentSettings,
                          hijriAdjustment:
                            next
                        })
                      );

                      return next;
                    }
                  );
                }
              }
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
                settings.numberStyle
              }
              onSelectedDateChange={
                setSelectedDate
              }
            />
          )}

          {activeView ===
            'converter' && (
            <DateConverterView
              hijriAdjustment={
                hijriAdjustment
              }
              numberStyle={
                settings.numberStyle
              }
            />
          )}

          {activeView ===
            'difference' && (
            <DateDifferenceView />
          )}

          {activeView ===
            'settings' && (
            <SettingsView
              theme={
                theme
              }
              settings={
                settings
              }
              onSettingsChange={
                setSettings
              }
              reminders={
                reminders
              }
              exceptions={
                exceptions
              }
              completed={
                completed
              }
              onImportBackup={
                data => {
                  if (
                    data?.settings
                  ) {
                    setSettings({
                      ...DEFAULT_SETTINGS,
                      ...data.settings
                    });
                  }

                  if (
                    Array.isArray(
                      data?.reminders
                    )
                  ) {
                    setReminders(
                      data.reminders
                    );
                  }

                  if (
                    Array.isArray(
                      data?.exceptions
                    )
                  ) {
                    setExceptions(
                      data.exceptions
                    );
                  }

                  if (
                    Array.isArray(
                      data?.completed
                    )
                  ) {
                    setCompleted(
                      data.completed
                    );
                  }
                }
              }
              onClearAllData={
                () => {
                  const confirmed =
                    window.confirm(
                      'هل تريد مسح جميع التذكيرات والبيانات؟'
                    );

                  if (!confirmed) {
                    return;
                  }

                  setReminders([]);
                  setExceptions([]);
                  setCompleted([]);
                  setSettings({
                    ...DEFAULT_SETTINGS
                  });
                }
              }
            />
          )}
        </main>
      </div>

      <StatusBar />

      {contextMenu && (
        <div
          className="fixed z-50 w-[220px] overflow-hidden rounded-xl border p-1 shadow-2xl"
          style={{
            left:
              contextMenu.x,
            top:
              contextMenu.y,
            background:
              'var(--bg-secondary)',
            borderColor:
              'var(--border)',
            boxShadow:
              'var(--shadow)'
          }}
          onClick={
            event =>
              event.stopPropagation()
          }
        >
          <div
            className="mb-1 border-b px-3 py-2"
            style={{
              borderColor:
                'var(--border)'
            }}
          >
            <div
              className="text-[10px]"
              style={{
                color:
                  'var(--text-muted)'
              }}
            >
              التاريخ
            </div>

            <div
              className="mt-1 text-xs font-bold"
              style={{
                color:
                  'var(--accent)'
              }}
            >
              {contextMenu.date.format(
                'YYYY/MM/DD'
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              openAddReminder(
                contextMenu.date
              )
            }
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right text-xs font-semibold"
          >
            <Bell
              size={16}
              style={{
                color:
                  'var(--accent)'
              }}
            />

            إضافة تذكير
          </button>

          <button
            type="button"
            onClick={() => {
              const items =
                getRemindersForDate(
                  reminders,
                  contextMenu.date,
                  exceptions
                );

              if (
                items.length > 0
              ) {
                openDetails(
                  items[0]
                );
              }

              setContextMenu(
                null
              );
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right text-xs font-semibold"
          >
            <Eye size={16} />

            عرض أول تذكير
          </button>

          {getContextDayItems().length >
            0 && (
            <button
              type="button"
              onClick={() => {
                const items =
                  getContextDayItems();

                if (
                  items.length > 0
                ) {
                  requestDelete(
                    items[0]
                  );
                }

                setContextMenu(
                  null
                );
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right text-xs font-semibold"
              style={{
                color:
                  'var(--danger)'
              }}
            >
              <Trash2 size={16} />

              حذف التذكير
            </button>
          )}
        </div>
      )}

      <ReminderForm
        isOpen={
          reminderFormOpen
        }
        selectedDate={
          reminderDate
        }
        editingReminder={
          editingReminder
        }
        defaultTime={
          settings.defaultReminderTime
        }
        numberStyle={
          settings.numberStyle
        }
        timeFormat={
          settings.timeFormat
        }
        onClose={() => {
          setReminderFormOpen(
            false
          );

          setReminderDate(
            null
          );

          setEditingReminder(
            null
          );
        }}
        onSave={
          saveReminder
        }
      />

      <ReminderDetailsModal
        isOpen={
          Boolean(
            selectedOccurrence
          )
        }
        occurrence={
          selectedOccurrence
        }
        onClose={() =>
          setSelectedOccurrence(
            null
          )
        }
        onEdit={
          editReminder
        }
        onDelete={
          requestDelete
        }
      />

      <DeleteReminderModal
        isOpen={
          Boolean(
            deleteOccurrence
          )
        }
        occurrence={
          deleteOccurrence
        }
        onClose={() =>
          setDeleteOccurrence(
            null
          )
        }
        onDeleteSingle={
          deleteSingle
        }
        onDeleteFollowing={
          deleteFollowing
        }
        onDeleteSeries={
          deleteSeries
        }
      />
    </div>
  );
}
