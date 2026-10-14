import moment from 'moment';
import hijriMoment from 'moment-hijri';

export const RECURRENCE_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

export const RECURRENCE_END_TYPES = {
  NEVER: 'never',
  DATE: 'date',
  COUNT: 'count'
};

const STORAGE_KEY =
  'gpt-dual-calendar-reminders';

const EXCEPTIONS_KEY =
  'gpt-dual-calendar-reminder-exceptions';

const COMPLETED_KEY =
  'gpt-dual-calendar-completed-reminders';

function createId(
  prefix = 'id'
) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function normalizeDate(
  date
) {
  return moment(date).format(
    'YYYY-MM-DD'
  );
}

function normalizeTime(
  time = '09:00'
) {
  const value =
    moment(
      time,
      [
        'HH:mm',
        'H:mm'
      ],
      true
    );

  return value.isValid()
    ? value.format(
        'HH:mm'
      )
    : '09:00';
}

export function createReminder({
  title,
  notes = '',
  date,
  time = '09:00',
  recurrenceType =
    RECURRENCE_TYPES.NONE,
  recurrenceInterval = 1,
  recurrenceEndType =
    RECURRENCE_END_TYPES.NEVER,
  recurrenceEndDate = null,
  recurrenceCount = null,
  recurrenceCalendar = 'gregorian',
  hijriAdjustment = 0
}) {
  const isRecurring =
    recurrenceType !==
    RECURRENCE_TYPES.NONE;

  const id =
    createId('rem');

  const now =
    new Date().toISOString();

  return {
    id,
    seriesId:
      isRecurring
        ? createId(
            'series'
          )
        : null,
    title:
      String(
        title || ''
      ).trim(),
    notes:
      String(
        notes || ''
      ).trim(),
    date:
      normalizeDate(
        date
      ),
    time:
      normalizeTime(
        time
      ),
    recurrence: {
      calendar: recurrenceCalendar === 'hijri' ? 'hijri' : 'gregorian',
      hijriAdjustment: Number(hijriAdjustment) || 0,
      type:
        recurrenceType,
      interval:
        Math.max(
          1,
          Number(
            recurrenceInterval
          ) || 1
        ),
      endType:
        recurrenceEndType,
      endDate:
        recurrenceEndDate
          ? normalizeDate(
              recurrenceEndDate
            )
          : null,
      count:
        recurrenceCount
          ? Math.max(
              1,
              Number(
                recurrenceCount
              )
            )
          : null
    },
    createdAt:
      now,
    updatedAt:
      now
  };
}

export function validateReminder(
  reminder
) {
  const errors = {};

  if (
    !reminder?.title?.trim()
  ) {
    errors.title =
      'عنوان التذكير مطلوب';
  }

  if (
    !moment(
      reminder?.date,
      'YYYY-MM-DD',
      true
    ).isValid()
  ) {
    errors.date =
      'تاريخ التذكير غير صالح';
  }

  if (
    !moment(
      reminder?.time,
      'HH:mm',
      true
    ).isValid()
  ) {
    errors.time =
      'وقت التذكير غير صالح';
  }

  if (
    reminder?.recurrence
      ?.endType ===
      RECURRENCE_END_TYPES.DATE &&
    !reminder.recurrence
      .endDate
  ) {
    errors.recurrenceEndDate =
      'حدد تاريخ انتهاء التكرار';
  }

  if (
    reminder?.recurrence
      ?.endType ===
      RECURRENCE_END_TYPES.COUNT &&
    (
      !reminder.recurrence
        .count ||
      reminder.recurrence
        .count < 1
    )
  ) {
    errors.recurrenceCount =
      'حدد عدد مرات التكرار';
  }

  return {
    valid:
      Object.keys(
        errors
      ).length === 0,
    errors
  };
}

function addRecurrence(
  date,
  recurrence,
  firstDate,
  occurrenceIndex
) {
  const result =
    moment(date);

  const interval =
    Math.max(
      1,
      recurrence
        ?.interval || 1
    );

  if (
    recurrence?.calendar === 'hijri' &&
    [RECURRENCE_TYPES.MONTHLY, RECURRENCE_TYPES.YEARLY].includes(recurrence.type)
  ) {
    const adjustment = Number(recurrence.hijriAdjustment) || 0;
    const anchor = hijriMoment(firstDate.toDate()).add(adjustment, 'days');
    const target = anchor.clone().iDate(1).add(
      occurrenceIndex * interval,
      recurrence.type === RECURRENCE_TYPES.MONTHLY ? 'iMonth' : 'iYear'
    );
    const lastDay = target.clone().endOf('iMonth').iDate();
    target.iDate(Math.min(anchor.iDate(), lastDay)).subtract(adjustment, 'days');
    return moment(target.toDate()).locale(firstDate.locale());
  }

  switch (
    recurrence?.type
  ) {
    case RECURRENCE_TYPES.DAILY:
      return result.add(
        interval,
        'days'
      );

    case RECURRENCE_TYPES.WEEKLY:
      return result.add(
        interval,
        'weeks'
      );

    case RECURRENCE_TYPES.MONTHLY:
      return result.add(
        interval,
        'months'
      );

    case RECURRENCE_TYPES.YEARLY:
      return result.add(
        interval,
        'years'
      );

    default:
      return result;
  }
}

export function generateReminderOccurrences(
  reminder,
  {
    rangeStart = null,
    rangeEnd = null,
    maxOccurrences = 500
  } = {}
) {
  if (!reminder) {
    return [];
  }

  const recurrence =
    reminder.recurrence || {
      type:
        RECURRENCE_TYPES.NONE
    };

  const firstDate =
    moment(
      reminder.date,
      'YYYY-MM-DD'
    );

  const startLimit =
    rangeStart
      ? moment(
          rangeStart
        ).startOf('day')
      : null;

  const endLimit =
    rangeEnd
      ? moment(
          rangeEnd
        ).endOf('day')
      : null;

  if (
    recurrence.type ===
    RECURRENCE_TYPES.NONE
  ) {
    if (
      startLimit &&
      firstDate.isBefore(
        startLimit,
        'day'
      )
    ) {
      return [];
    }

    if (
      endLimit &&
      firstDate.isAfter(
        endLimit,
        'day'
      )
    ) {
      return [];
    }

    return [
      {
        occurrenceId:
          `${reminder.id}_${reminder.date}`,
        reminderId:
          reminder.id,
        seriesId:
          reminder.seriesId,
        occurrenceIndex:
          1,
        date:
          reminder.date,
        time:
          reminder.time,
        title:
          reminder.title,
        notes:
          reminder.notes,
        source:
          reminder
      }
    ];
  }

  const result = [];

  let currentDate =
    firstDate.clone();

  let occurrenceIndex = 1;

  while (
    occurrenceIndex <=
    maxOccurrences
  ) {
    if (
      recurrence.endType ===
        RECURRENCE_END_TYPES.COUNT &&
      recurrence.count &&
      occurrenceIndex >
        recurrence.count
    ) {
      break;
    }

    if (
      recurrence.endType ===
        RECURRENCE_END_TYPES.DATE &&
      recurrence.endDate &&
      currentDate.isAfter(
        moment(
          recurrence.endDate,
          'YYYY-MM-DD'
        ),
        'day'
      )
    ) {
      break;
    }

    if (
      endLimit &&
      currentDate.isAfter(
        endLimit,
        'day'
      )
    ) {
      break;
    }

    if (
      !startLimit ||
      !currentDate.isBefore(
        startLimit,
        'day'
      )
    ) {
      result.push({
        occurrenceId:
          `${reminder.id}_${currentDate.format(
            'YYYY-MM-DD'
          )}`,
        reminderId:
          reminder.id,
        seriesId:
          reminder.seriesId,
        occurrenceIndex,
        date:
          currentDate.format(
            'YYYY-MM-DD'
          ),
        time:
          reminder.time,
        title:
          reminder.title,
        notes:
          reminder.notes,
        source:
          reminder
      });
    }

    const nextDate =
      addRecurrence(
        currentDate.clone(),
        recurrence,
        firstDate,
        occurrenceIndex
      );

    if (
      nextDate.isSame(
        currentDate,
        'day'
      )
    ) {
      break;
    }

    currentDate =
      nextDate;

    occurrenceIndex += 1;
  }

  return result;
}

export function loadReminderExceptions() {
  try {
    const raw =
      localStorage.getItem(
        EXCEPTIONS_KEY
      );

    const parsed =
      raw
        ? JSON.parse(
            raw
          )
        : [];

    return Array.isArray(
      parsed
    )
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function saveReminderExceptions(
  exceptions
) {
  localStorage.setItem(
    EXCEPTIONS_KEY,
    JSON.stringify(
      exceptions || []
    )
  );
}

export function getRemindersForDate(
  reminders,
  date,
  exceptions =
    loadReminderExceptions()
) {
  const target =
    normalizeDate(
      date
    );

  const hiddenIds =
    new Set(
      exceptions
    );

  const occurrences = [];

  for (
    const reminder of
      reminders || []
  ) {
    const items =
      generateReminderOccurrences(
        reminder,
        {
          rangeStart:
            target,
          rangeEnd:
            target
        }
      );

    occurrences.push(
      ...items.filter(
        item =>
          !hiddenIds.has(
            item.occurrenceId
          )
      )
    );
  }

  return occurrences.sort(
    (a, b) =>
      a.time.localeCompare(
        b.time
      )
  );
}

export function getRemindersForRange(
  reminders,
  startDate,
  endDate,
  exceptions =
    loadReminderExceptions()
) {
  const hiddenIds =
    new Set(
      exceptions
    );

  const occurrences = [];

  for (
    const reminder of
      reminders || []
  ) {
    occurrences.push(
      ...generateReminderOccurrences(
        reminder,
        {
          rangeStart:
            startDate,
          rangeEnd:
            endDate
        }
      ).filter(
        item =>
          !hiddenIds.has(
            item.occurrenceId
          )
      )
    );
  }

  return occurrences.sort(
    (a, b) => {
      const byDate =
        a.date.localeCompare(
          b.date
        );

      if (byDate !== 0) {
        return byDate;
      }

      return a.time.localeCompare(
        b.time
      );
    }
  );
}

export function updateReminder(
  reminder,
  changes
) {
  return {
    ...reminder,
    ...changes,
    recurrence: {
      ...reminder.recurrence,
      ...(
        changes.recurrence ||
        {}
      )
    },
    updatedAt:
      new Date().toISOString()
  };
}

export function deleteReminderById(
  reminders,
  reminderId
) {
  return (
    reminders || []
  ).filter(
    reminder =>
      reminder.id !==
      reminderId
  );
}

export function deleteReminderSeries(
  reminders,
  seriesId
) {
  if (!seriesId) {
    return reminders || [];
  }

  return (
    reminders || []
  ).filter(
    reminder =>
      reminder.seriesId !==
      seriesId
  );
}

export function deleteThisOccurrence(
  occurrenceId,
  exceptions
) {
  if (
    exceptions.includes(
      occurrenceId
    )
  ) {
    return exceptions;
  }

  return [
    ...exceptions,
    occurrenceId
  ];
}

export function deleteThisAndFollowing(
  reminders,
  reminderId,
  occurrenceDate
) {
  return (
    reminders || []
  ).map(
    reminder => {
      if (
        reminder.id !==
        reminderId
      ) {
        return reminder;
      }

      if (
        reminder.recurrence
          ?.type ===
        RECURRENCE_TYPES.NONE
      ) {
        return reminder;
      }

      const previousDay =
        moment(
          occurrenceDate
        )
          .subtract(
            1,
            'day'
          )
          .format(
            'YYYY-MM-DD'
          );

      return {
        ...reminder,
        recurrence: {
          ...reminder.recurrence,
          endType:
            RECURRENCE_END_TYPES.DATE,
          endDate:
            previousDay
        },
        updatedAt:
          new Date().toISOString()
      };
    }
  );
}

export function loadReminders() {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    const parsed =
      raw
        ? JSON.parse(
            raw
          )
        : [];

    return Array.isArray(
      parsed
    )
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function saveReminders(
  reminders
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      reminders || []
    )
  );
}


export function loadCompletedReminders() {
  try {
    const raw =
      localStorage.getItem(
        COMPLETED_KEY
      );

    const parsed =
      raw
        ? JSON.parse(
            raw
          )
        : [];

    return Array.isArray(
      parsed
    )
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function saveCompletedReminders(
  completed
) {
  localStorage.setItem(
    COMPLETED_KEY,
    JSON.stringify(
      completed || []
    )
  );
}

export function completeReminderOccurrence(
  completed,
  occurrence
) {
  if (
    !occurrence
  ) {
    return completed || [];
  }

  const exists =
    (completed || [])
      .some(
        item =>
          item.occurrenceId ===
          occurrence.occurrenceId
      );

  if (exists) {
    return completed || [];
  }

  return [
    ...(completed || []),
    {
      occurrenceId:
        occurrence.occurrenceId,
      reminderId:
        occurrence.reminderId,
      seriesId:
        occurrence.seriesId,
      title:
        occurrence.title,
      notes:
        occurrence.notes || '',
      date:
        occurrence.date,
      time:
        occurrence.time,
      completedAt:
        new Date().toISOString()
    }
  ];
}

export function restoreCompletedOccurrence(
  completed,
  occurrenceId
) {
  return (
    completed || []
  ).filter(
    item =>
      item.occurrenceId !==
      occurrenceId
  );
}


function escapePrintHtml(
  value
) {
  return String(
    value ?? ''
  )
    .replaceAll(
      '&',
      '&amp;'
    )
    .replaceAll(
      '<',
      '&lt;'
    )
    .replaceAll(
      '>',
      '&gt;'
    )
    .replaceAll(
      '"',
      '&quot;'
    );
}

export async function printReminderDocument(
  occurrence
) {
  if (
    !occurrence ||
    !window.desktopAPI
      ?.printHtml
  ) {
    return false;
  }

  const source =
    occurrence.source || {};

  const html = `
    <!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <style>
          @page {
            size: A4;
            margin: 16mm;
          }

          body {
            font-family: "Segoe UI", Tahoma, Arial, sans-serif;
            color: #222;
            margin: 0;
          }

          .card {
            border: 2px solid #e97824;
            border-radius: 16px;
            padding: 24px;
          }

          h1 {
            margin: 0 0 20px;
            color: #d76312;
            font-size: 24px;
          }

          .row {
            margin: 12px 0;
          }

          .label {
            color: #777;
            font-size: 11px;
          }

          .value {
            margin-top: 3px;
            font-size: 15px;
            font-weight: 700;
          }

          .notes {
            margin-top: 22px;
            padding-top: 16px;
            border-top: 1px solid #ddd;
            white-space: pre-wrap;
          }
        </style>
      </head>

      <body>
        <div class="card">
          <h1>${escapePrintHtml(
            occurrence.title
          )}</h1>

          <div class="row">
            <div class="label">التاريخ</div>
            <div class="value">${escapePrintHtml(
              occurrence.date
            )}</div>
          </div>

          <div class="row">
            <div class="label">الوقت</div>
            <div class="value">${escapePrintHtml(
              occurrence.time
            )}</div>
          </div>

          <div class="row">
            <div class="label">التكرار</div>
            <div class="value">${escapePrintHtml(
              source.recurrence
                ?.type ||
              'none'
            )}</div>
          </div>

          ${
            occurrence.notes
              ? `
                <div class="notes">
                  ${escapePrintHtml(
                    occurrence.notes
                  )}
                </div>
              `
              : ''
          }
        </div>
      </body>
    </html>
  `;

  const result =
    await window.desktopAPI
      .printHtml(
        html
      );

  return Boolean(
    result?.success
  );
}

export async function printMonthRemindersDocument(
  occurrences = [],
  title = 'تذكيرات الشهر'
) {
  if (
    !window.desktopAPI
      ?.printHtml
  ) {
    return false;
  }

  const cards =
    occurrences
      .map(
        item => {
          const source =
            item.source || {};

          const recurrence =
            source.recurrence
              ?.type ||
            'none';

          return `
            <section class="card">
              <h2>${escapePrintHtml(
                item.title
              )}</h2>

              <div class="grid">
                <div class="field">
                  <span class="label">التاريخ</span>
                  <strong>${escapePrintHtml(
                    item.date
                  )}</strong>
                </div>

                <div class="field">
                  <span class="label">الوقت</span>
                  <strong>${escapePrintHtml(
                    item.time
                  )}</strong>
                </div>

                <div class="field">
                  <span class="label">التكرار</span>
                  <strong>${escapePrintHtml(
                    recurrence
                  )}</strong>
                </div>
              </div>

              ${
                item.notes
                  ? `
                    <div class="notes">
                      <span class="label">التفاصيل / الملاحظات</span>
                      <div>${escapePrintHtml(
                        item.notes
                      )}</div>
                    </div>
                  `
                  : ''
              }
            </section>
          `;
        }
      )
      .join('');

  const html = `
    <!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />

        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            font-family:
              "Segoe UI",
              Tahoma,
              Arial,
              sans-serif;
            color: #222;
            margin: 0;
            background: #fff;
          }

          h1 {
            margin: 0 0 18px;
            color: #d76312;
            font-size: 24px;
          }

          .card {
            border: 1.5px solid #e4d4c3;
            border-radius: 14px;
            padding: 16px;
            margin-bottom: 12px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          h2 {
            margin: 0 0 12px;
            color: #d76312;
            font-size: 18px;
          }

          .grid {
            display: grid;
            grid-template-columns:
              repeat(
                3,
                minmax(
                  0,
                  1fr
                )
              );
            gap: 10px;
          }

          .field,
          .notes {
            background: #faf6f0;
            border-radius: 10px;
            padding: 10px;
          }

          .label {
            display: block;
            color: #777;
            font-size: 10px;
            margin-bottom: 4px;
          }

          .field strong {
            font-size: 13px;
          }

          .notes {
            margin-top: 10px;
            white-space: pre-wrap;
            line-height: 1.7;
            font-size: 12px;
          }
        </style>
      </head>

      <body>
        <h1>${escapePrintHtml(
          title
        )}</h1>

        ${cards}
      </body>
    </html>
  `;

  const result =
    await window.desktopAPI
      .printHtml(
        html
      );

  return Boolean(
    result?.success
  );
}
