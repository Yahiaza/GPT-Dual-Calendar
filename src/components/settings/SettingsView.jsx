import {
  Bell,
  CalendarClock,
  ChevronDown,
  Database,
  LayoutTemplate,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Settings2,
  Sun,
  Trash2
} from 'lucide-react';

import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  DEFAULT_COLOR_PALETTES,
  DEFAULT_SETTINGS,
  UI_STYLE_PRESETS,
  applyUiStylePreset,
  exportAppBackup,
  generateSmartPalette
} from '../../services/settingsService';

import UpdateCenter from './UpdateCenter';

const APPEARANCE_COLORS = [
  ['bgPrimary', 'خلفية التطبيق'],
  ['surface', 'الكروت'],
  ['border', 'الحدود'],
  ['accent', 'اللون الرئيسي'],
  ['textPrimary', 'النص الرئيسي'],
  ['calendarDayText', 'أرقام الأيام'],
  ['calendarWeekdayText', 'أسماء الأيام'],
  ['calendarWeekdayBg', 'خلفية أسماء الأيام'],
  ['calendarMonthText', 'اسم الشهر'],
  ['calendarTodayBg', 'اليوم الحالي'],
  ['calendarSelectedBg', 'اليوم المحدد'],
  ['dateHeaderBg', 'خلفية التاريخ العلوي'],
  ['dateHeaderText', 'نص التاريخ العلوي'],
  ['reminderPending', 'التذكير'],
  ['reminderDone', 'التذكير المكتمل']
];

function Toggle({
  checked,
  onChange
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className="relative h-6 w-11 rounded-full transition-all"
      style={{
        background:
          checked
            ? 'var(--accent)'
            : 'var(--surface-hover)'
      }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
        style={{
          right:
            checked
              ? '2px'
              : '20px'
        }}
      />
    </button>
  );
}

function Row({
  title,
  description,
  children
}) {
  return (
    <div
      className="flex items-center justify-between gap-5 rounded-xl border px-3 py-2.5"
      style={{
        background:
          'var(--bg-secondary)',
        borderColor:
          'var(--border)'
      }}
    >
      <div className="min-w-0">
        <div className="text-xs font-bold">
          {title}
        </div>

        {description && (
          <div
            className="mt-0.5 text-[9px]"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div className="shrink-0">
        {children}
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children
}) {
  return (
    <section
      className="rounded-2xl border p-4"
      style={{
        background:
          'var(--surface)',
        borderColor:
          'var(--border)'
      }}
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-extrabold">
        <Icon
          size={16}
          style={{
            color:
              'var(--accent)'
          }}
        />
        {title}
      </div>

      <div className="space-y-2">
        {children}
      </div>
    </section>
  );
}

function StyleCard({
  preset,
  active,
  onApply
}) {
  return (
    <button
      type="button"
      onClick={onApply}
      className="group relative overflow-hidden rounded-2xl border p-3 text-right transition-all hover:-translate-y-0.5"
      style={{
        background:
          active
            ? 'var(--accent-soft)'
            : 'var(--bg-secondary)',
        borderColor:
          active
            ? 'var(--accent)'
            : 'var(--border)',
        boxShadow:
          active
            ? '0 8px 22px rgba(30,70,110,.12)'
            : 'none'
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-extrabold">
            {preset.arabicName}
          </div>
          <div
            className="text-[9px] font-bold"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            {preset.name}
          </div>
        </div>

        <span
          className="h-8 w-8 rounded-xl border"
          style={{
            background:
              preset.accent,
            borderColor:
              'rgba(255,255,255,.5)'
          }}
        />
      </div>

      <div className="mb-3 flex h-16 gap-1.5">
        <span
          className="w-[24%]"
          style={{
            borderRadius:
              preset.id === 'ledger'
                ? '4px'
                : preset.id === 'orbit'
                  ? '16px'
                  : '10px',
            background:
              preset.light.sidebarBg,
            border:
              `1px solid ${preset.light.border}`
          }}
        />
        <span
          className="flex-1 p-1"
          style={{
            borderRadius:
              preset.id === 'ledger'
                ? '4px'
                : preset.id === 'orbit'
                  ? '18px'
                  : '10px',
            background:
              preset.light.calendarCardBg,
            border:
              `1px solid ${preset.light.border}`
          }}
        >
          <span
            className="block h-2 w-2/3"
            style={{
              borderRadius:
                preset.id === 'ledger'
                  ? '2px'
                  : '999px',
              background:
                preset.light.accentSoft
            }}
          />
          <span className="mt-2 grid grid-cols-4 gap-1">
            {[0,1,2,3,4,5,6,7].map(
              item => (
                <i
                  key={item}
                  className="block h-3"
                  style={{
                    borderRadius:
                      preset.id === 'orbit'
                        ? '5px'
                        : '1px',
                    background:
                      item === 5
                        ? preset.light.accent
                        : preset.light.bgPrimary
                  }}
                />
              )
            )}
          </span>
        </span>
      </div>

      <div
        className="text-[9px] leading-5"
        style={{
          color:
            'var(--text-secondary)'
        }}
      >
        {preset.description}
      </div>

      {active && (
        <div
          className="mt-2 text-[9px] font-extrabold"
          style={{
            color:
              'var(--accent)'
          }}
        >
          ✓ الشكل المستخدم حاليًا
        </div>
      )}
    </button>
  );
}

function ColorField({
  label,
  value,
  onChange
}) {
  return (
    <label
      className="flex items-center justify-between gap-2 rounded-xl border px-2.5 py-2"
      style={{
        background:
          'var(--bg-secondary)',
        borderColor:
          'var(--border)'
      }}
    >
      <span className="truncate text-[10px] font-bold">
        {label}
      </span>

      <input
        type="color"
        value={
          value ||
          '#000000'
        }
        onChange={
          event =>
            onChange(
              event.target.value
            )
        }
        className="h-7 w-9 cursor-pointer rounded-lg border bg-transparent p-0.5"
        style={{
          borderColor:
            'var(--border)'
        }}
      />
    </label>
  );
}

export default function SettingsView({
  settings,
  onSettingsChange,
  reminders,
  exceptions,
  completed,
  onImportBackup,
  onClearAllData,
  theme = 'light'
}) {
  const fileInputRef =
    useRef(null);

  const [
    tab,
    setTab
  ] = useState(
    'appearance'
  );

  const [
    paletteMode,
    setPaletteMode
  ] = useState(
    theme
  );

  const [
    smartBase,
    setSmartBase
  ] = useState(
    '#315f9a'
  );

  useEffect(() => {
    setPaletteMode(
      theme
    );
  }, [
    theme
  ]);

  const set =
    (
      key,
      value
    ) =>
      onSettingsChange({
        ...settings,
        [key]:
          value
      });

  const palette = {
    ...DEFAULT_COLOR_PALETTES[
      paletteMode
    ],
    ...(
      settings.colorPalettes?.[
        paletteMode
      ] ||
      {}
    )
  };

  const setColor =
    (
      key,
      value
    ) => {
      onSettingsChange({
        ...settings,
        colorPalettes: {
          ...settings.colorPalettes,
          [paletteMode]: {
            ...palette,
            [key]:
              value
          }
        }
      });
    };

  const applyStyle =
    styleId => {
      onSettingsChange(
        applyUiStylePreset(
          settings,
          styleId
        )
      );
    };

  const applySmartColor =
    () => {
      onSettingsChange({
        ...settings,
        colorPalettes: {
          light:
            generateSmartPalette(
              smartBase,
              'light'
            ),
          dark:
            generateSmartPalette(
              smartBase,
              'dark'
            )
        }
      });
    };

  const tabs = [
    {
      id: 'appearance',
      label: 'المظهر',
      icon: Palette
    },
    {
      id: 'calendar',
      label: 'التقويم',
      icon: CalendarClock
    },
    {
      id: 'reminders',
      label: 'التذكيرات',
      icon: Bell
    },
    {
      id: 'system',
      label: 'النظام والبيانات',
      icon: Database
    }
  ];

  const selectStyle = {
    background:
      'var(--bg-secondary)',
    color:
      'var(--text-primary)',
    borderColor:
      'var(--border)'
  };

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Settings2
              size={20}
              style={{
                color:
                  'var(--accent)'
              }}
            />
            <h1 className="text-xl font-extrabold">
              الإعدادات
            </h1>
          </div>

          <div
            className="mt-1 text-[10px]"
            style={{
              color:
                'var(--text-muted)'
            }}
          >
            تم تنظيم إعدادات الألوان داخل قسم واحد بدل عرض عشرات الخيارات في الصفحة.
          </div>
        </div>

        <div
          className="mb-4 grid grid-cols-4 gap-1 rounded-2xl border p-1"
          style={{
            background:
              'var(--surface)',
            borderColor:
              'var(--border)'
          }}
        >
          {tabs.map(
            item => {
              const Icon =
                item.icon;

              const active =
                tab ===
                item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setTab(
                      item.id
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[10px] font-extrabold transition-all"
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
                  <Icon size={13} />
                  {item.label}
                </button>
              );
            }
          )}
        </div>

        {tab ===
          'appearance' && (
          <div className="space-y-4">
            <Section
              title="شكل التطبيق"
              icon={
                LayoutTemplate
              }
            >
              <div className="grid grid-cols-3 gap-3">
                {Object.values(
                  UI_STYLE_PRESETS
                ).map(
                  preset => (
                    <StyleCard
                      key={
                        preset.id
                      }
                      preset={
                        preset
                      }
                      active={
                        settings.visualStyle ===
                        preset.id
                      }
                      onApply={() =>
                        applyStyle(
                          preset.id
                        )
                      }
                    />
                  )
                )}
              </div>

              <div
                className="rounded-xl px-3 py-2 text-[9px] font-semibold"
                style={{
                  background:
                    'var(--accent-soft)',
                  color:
                    'var(--text-secondary)'
                }}
              >
                اختيار الشكل يغيّر توزيع المساحات والحواف وشكل شبكة الأيام وشريط التنقل، ويطبّق ألوانه المقترحة. بعد ذلك يمكنك تعديل الألوان يدويًا إذا أردت.
              </div>
            </Section>

            <Section
              title="الألوان"
              icon={Palette}
            >
              <div className="grid grid-cols-[auto_minmax(160px,1fr)_auto] items-end gap-2">
                <div
                  className="flex items-center gap-1 rounded-xl border p-1"
                  style={{
                    background:
                      'var(--bg-secondary)',
                    borderColor:
                      'var(--border)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setPaletteMode(
                        'light'
                      )
                    }
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-[9px] font-extrabold"
                    style={{
                      background:
                        paletteMode ===
                        'light'
                          ? 'var(--accent-soft)'
                          : 'transparent',
                      color:
                        paletteMode ===
                        'light'
                          ? 'var(--accent)'
                          : 'var(--text-muted)'
                    }}
                  >
                    <Sun size={12} />
                    فاتح
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPaletteMode(
                        'dark'
                      )
                    }
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-[9px] font-extrabold"
                    style={{
                      background:
                        paletteMode ===
                        'dark'
                          ? 'var(--accent-soft)'
                          : 'transparent',
                      color:
                        paletteMode ===
                        'dark'
                          ? 'var(--accent)'
                          : 'var(--text-muted)'
                    }}
                  >
                    <Moon size={12} />
                    داكن
                  </button>
                </div>

                <label>
                  <div
                    className="mb-1 text-[9px] font-bold"
                    style={{
                      color:
                        'var(--text-muted)'
                    }}
                  >
                    لون أساسي ذكي
                  </div>

                  <div
                    className="flex h-10 items-center gap-2 rounded-xl border px-2"
                    style={{
                      background:
                        'var(--bg-secondary)',
                      borderColor:
                        'var(--border)'
                    }}
                  >
                    <input
                      type="color"
                      value={
                        smartBase
                      }
                      onChange={
                        event =>
                          setSmartBase(
                            event.target.value
                          )
                      }
                      className="h-7 w-9"
                    />
                    <span
                      dir="ltr"
                      className="text-[9px] font-extrabold"
                    >
                      {smartBase.toUpperCase()}
                    </span>
                  </div>
                </label>

                <button
                  type="button"
                  onClick={
                    applySmartColor
                  }
                  className="h-10 rounded-xl px-4 text-[10px] font-extrabold text-white"
                  style={{
                    background:
                      'var(--accent)'
                  }}
                >
                  توليد تناسق
                </button>
              </div>

              <details
                className="group rounded-xl border"
                style={{
                  borderColor:
                    'var(--border)',
                  background:
                    'var(--bg-secondary)'
                }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 text-[10px] font-extrabold">
                  <span>
                    الألوان المتقدمة
                  </span>
                  <ChevronDown
                    size={14}
                    style={{
                      color:
                        'var(--text-muted)'
                    }}
                  />
                </summary>

                <div
                  className="grid grid-cols-3 gap-2 border-t p-3"
                  style={{
                    borderColor:
                      'var(--border)'
                  }}
                >
                  {APPEARANCE_COLORS.map(
                    (
                      [
                        key,
                        label
                      ]
                    ) => (
                      <ColorField
                        key={key}
                        label={label}
                        value={
                          palette[key]
                        }
                        onChange={
                          value =>
                            setColor(
                              key,
                              value
                            )
                        }
                      />
                    )
                  )}
                </div>
              </details>
            </Section>
          </div>
        )}

        {tab ===
          'calendar' && (
          <div className="grid grid-cols-2 gap-4">
            <Section
              title="التقويم"
              icon={
                CalendarClock
              }
            >
              <Row
                title="ضبط التاريخ الهجري"
                description="القيمة الافتراضية المستخدمة في العرض والتحويل"
              >
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'hijriAdjustment',
                        Number(
                          settings.hijriAdjustment ||
                          0
                        ) - 1
                      )
                    }
                    className="h-8 w-8 rounded-lg border"
                    style={{
                      borderColor:
                        'var(--border)'
                    }}
                  >
                    −
                  </button>
                  <b className="min-w-[32px] text-center text-xs">
                    {settings.hijriAdjustment}
                  </b>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'hijriAdjustment',
                        Number(
                          settings.hijriAdjustment ||
                          0
                        ) + 1
                      )
                    }
                    className="h-8 w-8 rounded-lg border"
                    style={{
                      borderColor:
                        'var(--border)'
                    }}
                  >
                    +
                  </button>
                </div>
              </Row>

              <Row title="شكل الأرقام">
                <select
                  value={
                    settings.numberStyle
                  }
                  onChange={
                    event =>
                      set(
                        'numberStyle',
                        event.target.value
                      )
                  }
                  className="rounded-lg border px-3 py-2 text-xs"
                  style={
                    selectStyle
                  }
                >
                  <option value="western">
                    123
                  </option>
                  <option value="arabic">
                    ١٢٣
                  </option>
                </select>
              </Row>

              <Row title="تنسيق الوقت">
                <select
                  value={
                    settings.timeFormat
                  }
                  onChange={
                    event =>
                      set(
                        'timeFormat',
                        event.target.value
                      )
                  }
                  className="rounded-lg border px-3 py-2 text-xs"
                  style={
                    selectStyle
                  }
                >
                  <option value="24">
                    24 ساعة
                  </option>
                  <option value="12">
                    12 ساعة ص/م
                  </option>
                </select>
              </Row>
            </Section>
          </div>
        )}

        {tab ===
          'reminders' && (
          <div className="grid grid-cols-2 gap-4">
            <Section
              title="الإشعارات"
              icon={Bell}
            >
              <Row title="إشعارات Windows">
                <Toggle
                  checked={
                    settings.notificationsEnabled
                  }
                  onChange={
                    value =>
                      set(
                        'notificationsEnabled',
                        value
                      )
                  }
                />
              </Row>

              <Row title="التنبيه قبل الموعد">
                <select
                  value={
                    settings.notificationLeadMinutes
                  }
                  onChange={
                    event =>
                      set(
                        'notificationLeadMinutes',
                        Number(
                          event.target.value
                        )
                      )
                  }
                  className="rounded-lg border px-3 py-2 text-xs"
                  style={
                    selectStyle
                  }
                >
                  <option value={0}>
                    عند الموعد
                  </option>
                  <option value={5}>
                    قبل 5 دقائق
                  </option>
                  <option value={10}>
                    قبل 10 دقائق
                  </option>
                  <option value={30}>
                    قبل 30 دقيقة
                  </option>
                </select>
              </Row>

              <Row title="صوت التنبيه">
                <Toggle
                  checked={
                    settings.notificationSound
                  }
                  onChange={
                    value =>
                      set(
                        'notificationSound',
                        value
                      )
                  }
                />
              </Row>
            </Section>

            <Section
              title="التذكيرات"
              icon={
                CalendarClock
              }
            >
              <Row title="الوقت الافتراضي">
                <input
                  type="time"
                  value={
                    settings.defaultReminderTime
                  }
                  onChange={
                    event =>
                      set(
                        'defaultReminderTime',
                        event.target.value
                      )
                  }
                  className="rounded-lg border px-3 py-2 text-xs"
                  style={
                    selectStyle
                  }
                />
              </Row>

              <Row title="إظهار المنجز في الشهر">
                <Toggle
                  checked={
                    settings.showCompletedInMonth
                  }
                  onChange={
                    value =>
                      set(
                        'showCompletedInMonth',
                        value
                      )
                  }
                />
              </Row>

              <Row title="تأكيد حذف السلسلة">
                <Toggle
                  checked={
                    settings.confirmSeriesDelete
                  }
                  onChange={
                    value =>
                      set(
                        'confirmSeriesDelete',
                        value
                      )
                  }
                />
              </Row>
            </Section>
          </div>
        )}

        {tab ===
          'system' && (
          <div className="grid grid-cols-2 gap-4">
            <Section
              title="سلوك التطبيق"
              icon={Settings2}
            >
              <Row title="عند الضغط على X">
                <select
                  value={
                    settings.closeBehavior
                  }
                  onChange={
                    event =>
                      set(
                        'closeBehavior',
                        event.target.value
                      )
                  }
                  className="rounded-lg border px-3 py-2 text-xs"
                  style={
                    selectStyle
                  }
                >
                  <option value="tray">
                    إخفاء إلى Tray
                  </option>
                  <option value="exit">
                    خروج نهائي
                  </option>
                </select>
              </Row>

              <button
                type="button"
                onClick={() =>
                  onSettingsChange({
                    ...DEFAULT_SETTINGS,
                    colorPalettes: {
                      ...DEFAULT_SETTINGS.colorPalettes
                    }
                  })
                }
                className="flex items-center gap-2 text-[10px] font-bold"
                style={{
                  color:
                    'var(--text-muted)'
                }}
              >
                <RotateCcw size={12} />
                استعادة الإعدادات الافتراضية
              </button>
            </Section>

            <Section
              title="النسخ الاحتياطي"
              icon={Database}
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    exportAppBackup({
                      settings,
                      reminders,
                      exceptions,
                      completed
                    })
                  }
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white"
                  style={{
                    background:
                      'var(--accent)'
                  }}
                >
                  <Save size={14} />
                  تصدير نسخة
                </button>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="rounded-xl border px-3 py-2 text-xs font-bold"
                  style={{
                    borderColor:
                      'var(--border)'
                  }}
                >
                  استيراد نسخة
                </button>

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={
                    async event => {
                      const file =
                        event.target.files?.[0];

                      if (!file) {
                        return;
                      }

                      const data =
                        JSON.parse(
                          await file.text()
                        );

                      onImportBackup(
                        data
                      );

                      event.target.value =
                        '';
                    }
                  }
                />

                <button
                  type="button"
                  onClick={
                    onClearAllData
                  }
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold"
                  style={{
                    background:
                      'var(--danger-soft)',
                    color:
                      'var(--danger)'
                  }}
                >
                  <Trash2 size={14} />
                  مسح البيانات
                </button>
              </div>

              <UpdateCenter />
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
