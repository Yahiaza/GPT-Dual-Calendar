export const SETTINGS_KEY =
  'gpt-dual-calendar-settings';

/*
 * الألوان الأساسية لكل وضع.
 * يمكن للمستخدم تغيير كل قيمة من شاشة الإعدادات.
 */
export const DEFAULT_COLOR_PALETTES = {
  light: {
    bgPrimary: '#f4efe6',
    bgSecondary: '#fffbf4',
    surface: '#fffdf9',
    surfaceHover: '#fbe9d9',

    textPrimary: '#302b26',
    textSecondary: '#655d55',
    textMuted: '#91867b',

    border: '#ded5ca',

    accent: '#e97824',
    accentStrong: '#d76312',
    accentSoft: '#fbe7d7',

    danger: '#d9534f',
    dangerSoft: '#f9e3e2',

    topbarBg: '#fffbf4',
    topbarText: '#302b26',
    sidebarBg: '#fffdf9',
    reminderPanelBg: '#fffbf4',

    calendarCardBg: '#fffdf9',
    calendarGridLine: '#e7ded5',
    calendarDayText: '#25201c',
    calendarWeekdayText: '#8d8176',
    calendarWeekdayBg: '#fff8f1',
    calendarWeekdayBorder: '#eadfd4',
    calendarMonthText: '#302b26',
    calendarSubtitleText: '#91867b',

    calendarSelectedBg: '#fbe7d7',
    calendarSelectedText: '#302b26',

    calendarTodayBg: '#e97824',
    calendarTodayText: '#ffffff',

    dateHeaderBg: '#fff3e8',
    dateHeaderBorder: '#e97824',
    dateHeaderText: '#d76312',

    clockBg: '#fffdf9',
    clockText: '#e97824',

    reminderPending: '#e97824',
    reminderPartial: '#3b82f6',
    reminderDone: '#22c55e',

    converterHijri: '#16a34a'
  },

  dark: {
    bgPrimary: '#1c2027',
    bgSecondary: '#1f242d',
    surface: '#252b35',
    surfaceHover: '#2d3b50',

    textPrimary: '#f2f4f7',
    textSecondary: '#c4cad2',
    textMuted: '#8e98a6',

    border: '#3b4350',

    accent: '#4f74ad',
    accentStrong: '#6f93ca',
    accentSoft: '#2d4162',

    danger: '#ef6a67',
    dangerSoft: '#4a292c',

    topbarBg: '#1f242d',
    topbarText: '#f2f4f7',
    sidebarBg: '#202631',
    reminderPanelBg: '#202631',

    calendarCardBg: '#252b35',
    calendarGridLine: '#39414d',
    calendarDayText: '#f2f4f7',
    calendarWeekdayText: '#a8b2c1',
    calendarWeekdayBg: '#232b36',
    calendarWeekdayBorder: '#39414d',
    calendarMonthText: '#f6f8fb',
    calendarSubtitleText: '#8e98a6',

    calendarSelectedBg: '#2d4162',
    calendarSelectedText: '#f2f4f7',

    calendarTodayBg: '#4f74ad',
    calendarTodayText: '#ffffff',

    dateHeaderBg: '#25364f',
    dateHeaderBorder: '#6f93ca',
    dateHeaderText: '#b9cff0',

    clockBg: '#252b35',
    clockText: '#8fb1e1',

    reminderPending: '#6f93ca',
    reminderPartial: '#60a5fa',
    reminderDone: '#4ade80',

    converterHijri: '#4ade80'
  }
};

/*
 * Preset كحلي / أبيض / رمادي مائل للأزرق
 * قريب من التصميم المقترح للتطبيق.
 */
export const COLOR_PRESETS = {
  navy: {
    light: {
      bgPrimary: '#f3f6f9',
      bgSecondary: '#ffffff',
      surface: '#ffffff',
      surfaceHover: '#edf2f7',

      textPrimary: '#10264a',
      textSecondary: '#4f6278',
      textMuted: '#8290a1',

      border: '#dbe3ec',

      accent: '#0b2f63',
      accentStrong: '#071f46',
      accentSoft: '#e9f0f8',

      danger: '#d84f4f',
      dangerSoft: '#f8e6e6',

      topbarBg: '#ffffff',
      topbarText: '#10264a',
      sidebarBg: '#fbfcfe',
      reminderPanelBg: '#fbfcfe',

      calendarCardBg: '#ffffff',
      calendarGridLine: '#dfe6ee',
      calendarDayText: '#10284d',
      calendarWeekdayText: '#63758c',
      calendarWeekdayBg: '#f6f9fc',
      calendarWeekdayBorder: '#dbe3ec',
      calendarMonthText: '#0b2850',
      calendarSubtitleText: '#7b8a9d',

      calendarSelectedBg: '#e6edf7',
      calendarSelectedText: '#0a2a5b',

      calendarTodayBg: '#0a2a5b',
      calendarTodayText: '#ffffff',

      dateHeaderBg: '#f8fafc',
      dateHeaderBorder: '#0a2a5b',
      dateHeaderText: '#0a2a5b',

      clockBg: '#ffffff',
      clockText: '#0a2a5b',

      reminderPending: '#1f5fae',
      reminderPartial: '#3b82f6',
      reminderDone: '#1f9d68',

      converterHijri: '#19745f'
    },

    dark: {
      bgPrimary: '#0d1624',
      bgSecondary: '#111d2e',
      surface: '#162338',
      surfaceHover: '#1d2e48',

      textPrimary: '#eef4fb',
      textSecondary: '#bdc9d8',
      textMuted: '#8292a8',

      border: '#293b55',

      accent: '#5f8fd3',
      accentStrong: '#7aa8e7',
      accentSoft: '#203a5d',

      danger: '#ef6a67',
      dangerSoft: '#48272d',

      topbarBg: '#101b2b',
      topbarText: '#eef4fb',
      sidebarBg: '#111d2e',
      reminderPanelBg: '#111d2e',

      calendarCardBg: '#142136',
      calendarGridLine: '#2b3b53',
      calendarDayText: '#f1f5fa',
      calendarWeekdayText: '#a8b8cc',
      calendarWeekdayBg: '#17263b',
      calendarWeekdayBorder: '#2b3b53',
      calendarMonthText: '#f5f8fc',
      calendarSubtitleText: '#8798ae',

      calendarSelectedBg: '#203a5d',
      calendarSelectedText: '#ffffff',

      calendarTodayBg: '#2d5f9f',
      calendarTodayText: '#ffffff',

      dateHeaderBg: '#14243b',
      dateHeaderBorder: '#5f8fd3',
      dateHeaderText: '#a9c8ef',

      clockBg: '#142136',
      clockText: '#8db7eb',

      reminderPending: '#78a6e3',
      reminderPartial: '#60a5fa',
      reminderDone: '#4ade80',

      converterHijri: '#56d49b'
    }
  }
};


/*
 * ثلاثة أشكال كاملة للواجهة.
 * كل شكل له Palette مقترحة للـLight والـDark،
 * لكن يظل المستخدم قادرًا على تعديل الألوان يدويًا.
 */
export const UI_STYLE_PRESETS = {
  classic: {
    id: 'classic',
    name: 'Classic',
    arabicName: 'كلاسيك',
    description:
      'الواجهة المتوازنة المعروفة مع بطاقات واضحة وشبكة تقويم تقليدية.',
    accent: '#173f73',
    light: {
      ...COLOR_PRESETS.navy.light
    },
    dark: {
      ...COLOR_PRESETS.navy.dark
    }
  },

  orbit: {
    id: 'orbit',
    name: 'Orbit',
    arabicName: 'أوربت',
    description:
      'واجهة عائمة حديثة، حواف كبيرة، أيام Tiles منفصلة وNavigation أخف.',
    accent: '#315f9a',
    light: {
      bgPrimary: '#eef3f8',
      bgSecondary: '#f7f9fc',
      surface: '#ffffff',
      surfaceHover: '#e9f0f7',

      textPrimary: '#10243f',
      textSecondary: '#52667d',
      textMuted: '#8292a6',

      border: '#d8e2ec',

      accent: '#315f9a',
      accentStrong: '#173f73',
      accentSoft: '#e3edf8',

      danger: '#d95a60',
      dangerSoft: '#f8e8ea',

      topbarBg: '#f9fbfd',
      topbarText: '#15385f',
      sidebarBg: '#f9fbfd',
      reminderPanelBg: '#f9fbfd',

      calendarCardBg: '#fbfdff',
      calendarGridLine: '#dfe8f1',
      calendarDayText: '#18314f',
      calendarWeekdayText: '#50677f',
      calendarWeekdayBg: '#edf3f8',
      calendarWeekdayBorder: '#dce6ef',
      calendarMonthText: '#143b68',
      calendarSubtitleText: '#71849a',

      calendarSelectedBg: '#dce9f6',
      calendarSelectedText: '#153b65',

      calendarTodayBg: '#244f82',
      calendarTodayText: '#ffffff',

      dateHeaderBg: '#f8fbfe',
      dateHeaderBorder: '#7d9fc4',
      dateHeaderText: '#173f73',

      clockBg: '#f8fbfe',
      clockText: '#315f9a',

      reminderPending: '#3f78b7',
      reminderPartial: '#7287c5',
      reminderDone: '#2f8c71',

      converterHijri: '#287a65'
    },
    dark: {
      bgPrimary: '#0d1725',
      bgSecondary: '#111e2f',
      surface: '#16253a',
      surfaceHover: '#20344f',

      textPrimary: '#eff5fb',
      textSecondary: '#bdcad8',
      textMuted: '#8192a8',

      border: '#293f5c',

      accent: '#6e9ed8',
      accentStrong: '#91b8e5',
      accentSoft: '#203d62',

      danger: '#ef7278',
      dangerSoft: '#482a31',

      topbarBg: '#111e2f',
      topbarText: '#edf4fb',
      sidebarBg: '#122033',
      reminderPanelBg: '#122033',

      calendarCardBg: '#15243a',
      calendarGridLine: '#2a405d',
      calendarDayText: '#edf4fb',
      calendarWeekdayText: '#b0c0d2',
      calendarWeekdayBg: '#1b2e47',
      calendarWeekdayBorder: '#2e4766',
      calendarMonthText: '#f5f8fc',
      calendarSubtitleText: '#91a4bb',

      calendarSelectedBg: '#24476f',
      calendarSelectedText: '#ffffff',

      calendarTodayBg: '#4d7fb9',
      calendarTodayText: '#ffffff',

      dateHeaderBg: '#142840',
      dateHeaderBorder: '#6e9ed8',
      dateHeaderText: '#b8d2ef',

      clockBg: '#15243a',
      clockText: '#91b8e5',

      reminderPending: '#7aa8dc',
      reminderPartial: '#8d99d2',
      reminderDone: '#55c59a',

      converterHijri: '#5bc5a1'
    }
  },

  ledger: {
    id: 'ledger',
    name: 'Ledger',
    arabicName: 'ليدجر',
    description:
      'مظهر أعمال كثيف ومنظم: خطوط مستقيمة، رؤوس داكنة وشبكة دقيقة مثل دفاتر العمل.',
    accent: '#176c72',
    light: {
      bgPrimary: '#edf1f4',
      bgSecondary: '#f5f7f9',
      surface: '#ffffff',
      surfaceHover: '#edf3f4',

      textPrimary: '#172936',
      textSecondary: '#52636e',
      textMuted: '#81909a',

      border: '#cfd9df',

      accent: '#176c72',
      accentStrong: '#0f4f55',
      accentSoft: '#dfeff0',

      danger: '#c94e56',
      dangerSoft: '#f6e5e7',

      topbarBg: '#163046',
      topbarText: '#ffffff',
      sidebarBg: '#f2f5f7',
      reminderPanelBg: '#f7f9fa',

      calendarCardBg: '#ffffff',
      calendarGridLine: '#cfd9df',
      calendarDayText: '#1b2d3a',
      calendarWeekdayText: '#ffffff',
      calendarWeekdayBg: '#24465e',
      calendarWeekdayBorder: '#31566f',
      calendarMonthText: '#173a51',
      calendarSubtitleText: '#647783',

      calendarSelectedBg: '#e0eff0',
      calendarSelectedText: '#0f5056',

      calendarTodayBg: '#176c72',
      calendarTodayText: '#ffffff',

      dateHeaderBg: '#ffffff',
      dateHeaderBorder: '#98aab5',
      dateHeaderText: '#183b50',

      clockBg: '#203f56',
      clockText: '#ffffff',

      reminderPending: '#327a9a',
      reminderPartial: '#806fa7',
      reminderDone: '#357c61',

      converterHijri: '#357c61'
    },
    dark: {
      bgPrimary: '#11181e',
      bgSecondary: '#161f26',
      surface: '#1c272f',
      surfaceHover: '#26343e',

      textPrimary: '#eef3f5',
      textSecondary: '#bdc8cd',
      textMuted: '#84939a',

      border: '#35434b',

      accent: '#5ab0b5',
      accentStrong: '#7cc9cd',
      accentSoft: '#1f4448',

      danger: '#e66d74',
      dangerSoft: '#452a2e',

      topbarBg: '#142b3b',
      topbarText: '#eef3f5',
      sidebarBg: '#172128',
      reminderPanelBg: '#172128',

      calendarCardBg: '#1b252c',
      calendarGridLine: '#37464f',
      calendarDayText: '#eef3f5',
      calendarWeekdayText: '#eef8f9',
      calendarWeekdayBg: '#244b52',
      calendarWeekdayBorder: '#37646a',
      calendarMonthText: '#f5f8f9',
      calendarSubtitleText: '#9aabb2',

      calendarSelectedBg: '#21464a',
      calendarSelectedText: '#ffffff',

      calendarTodayBg: '#438e93',
      calendarTodayText: '#ffffff',

      dateHeaderBg: '#1b2d37',
      dateHeaderBorder: '#5ab0b5',
      dateHeaderText: '#a9d9dc',

      clockBg: '#173541',
      clockText: '#c0ebed',

      reminderPending: '#6eb1c5',
      reminderPartial: '#9d8ec6',
      reminderDone: '#67bd92',

      converterHijri: '#67bd92'
    }
  }
};

export function applyUiStylePreset(
  settings,
  styleId
) {
  const preset =
    UI_STYLE_PRESETS[
      styleId
    ] ||
    UI_STYLE_PRESETS.classic;

  return {
    ...settings,
    visualStyle:
      preset.id,
    colorPalettes: {
      light: {
        ...preset.light
      },
      dark: {
        ...preset.dark
      }
    }
  };
}


export const COLOR_VARIABLE_MAP = {
  bgPrimary: '--bg-primary',
  bgSecondary: '--bg-secondary',
  surface: '--surface',
  surfaceHover: '--surface-hover',

  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  textMuted: '--text-muted',

  border: '--border',

  accent: '--accent',
  accentStrong: '--accent-strong',
  accentSoft: '--accent-soft',

  danger: '--danger',
  dangerSoft: '--danger-soft',

  topbarBg: '--topbar-bg',
  topbarText: '--topbar-text',
  sidebarBg: '--sidebar-bg',
  reminderPanelBg: '--reminder-panel-bg',

  calendarCardBg: '--calendar-card-bg',
  calendarGridLine: '--calendar-grid-line',
  calendarDayText: '--calendar-day-text',
  calendarWeekdayText: '--calendar-weekday-text',
  calendarWeekdayBg: '--calendar-weekday-bg',
  calendarWeekdayBorder: '--calendar-weekday-border',
  calendarMonthText: '--calendar-month-text',
  calendarSubtitleText: '--calendar-subtitle-text',

  calendarSelectedBg: '--calendar-selected-bg',
  calendarSelectedText: '--calendar-selected-text',

  calendarTodayBg: '--calendar-today-bg',
  calendarTodayText: '--calendar-today-text',

  dateHeaderBg: '--date-header-bg',
  dateHeaderBorder: '--date-header-border',
  dateHeaderText: '--date-header-text',

  clockBg: '--clock-bg',
  clockText: '--clock-text',

  reminderPending: '--reminder-pending',
  reminderPartial: '--reminder-partial',
  reminderDone: '--reminder-done',

  converterHijri: '--converter-hijri'
};

export const DEFAULT_SETTINGS = {
  /*
   * شكل الواجهة مستقل عن Light/Dark وعن تخصيص الألوان.
   * classic | orbit | ledger
   */
  visualStyle: 'classic',

  hijriAdjustment: 0,

  /*
   * ترتيب لوحتي التقويم:
   * false = الهجري يمين / الميلادي يسار (الوضع الحالي)
   * true  = الميلادي يمين / الهجري يسار
   */
  reverseCalendarOrder: false,

  timeFormat: '24',

  numberStyle: 'western',

  notificationsEnabled: true,

  notificationLeadMinutes: 0,

  notificationSound: true,

  closeBehavior: 'tray',

  defaultReminderTime:
    '09:00',

  confirmSeriesDelete: true,

  showCompletedInMonth: true,

  colorPalettes:
    DEFAULT_COLOR_PALETTES,

  savedThemes: []
};

function mergePalettes(
  savedPalettes = {}
) {
  return {
    light: {
      ...DEFAULT_COLOR_PALETTES.light,
      ...(
        savedPalettes.light ||
        {}
      )
    },

    dark: {
      ...DEFAULT_COLOR_PALETTES.dark,
      ...(
        savedPalettes.dark ||
        {}
      )
    }
  };
}

export function loadSettings() {
  try {
    const raw =
      localStorage.getItem(
        SETTINGS_KEY
      );

    const saved =
      raw
        ? JSON.parse(
            raw
          )
        : {};

    return {
      ...DEFAULT_SETTINGS,
      ...saved,

      colorPalettes:
        mergePalettes(
          saved.colorPalettes
        )
    };
  } catch {
    return {
      ...DEFAULT_SETTINGS,

      colorPalettes:
        mergePalettes()
    };
  }
}

export function saveSettings(
  settings
) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(
      settings
    )
  );
}

export function applyColorSettings(
  settings,
  theme = 'light'
) {
  const root =
    document.documentElement;

  const palette = {
    ...DEFAULT_COLOR_PALETTES[
      theme
    ],
    ...(
      settings?.colorPalettes?.[
        theme
      ] ||
      {}
    )
  };

  Object.entries(
    COLOR_VARIABLE_MAP
  ).forEach(
    (
      [
        key,
        variable
      ]
    ) => {
      const value =
        palette[key];

      if (!value) {
        return;
      }

      root.style.setProperty(
        variable,
        value
      );
    }
  );
}


function colorClamp(
  value,
  min = 0,
  max = 1
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}

function hexToRgb(
  hex
) {
  const normalized =
    String(
      hex || ''
    )
      .replace('#', '')
      .trim();

  if (
    !/^[0-9a-fA-F]{6}$/.test(
      normalized
    )
  ) {
    return {
      r: 11,
      g: 47,
      b: 99
    };
  }

  return {
    r:
      parseInt(
        normalized.slice(0, 2),
        16
      ),
    g:
      parseInt(
        normalized.slice(2, 4),
        16
      ),
    b:
      parseInt(
        normalized.slice(4, 6),
        16
      )
  };
}

function rgbToHex({
  r,
  g,
  b
}) {
  const toHex =
    value =>
      Math.round(
        Math.max(
          0,
          Math.min(
            255,
            value
          )
        )
      )
        .toString(16)
        .padStart(
          2,
          '0'
        );

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixColors(
  colorA,
  colorB,
  amount = 0.5
) {
  const a =
    hexToRgb(
      colorA
    );

  const b =
    hexToRgb(
      colorB
    );

  const t =
    colorClamp(
      amount
    );

  return rgbToHex({
    r:
      a.r +
      (
        b.r -
        a.r
      ) * t,
    g:
      a.g +
      (
        b.g -
        a.g
      ) * t,
    b:
      a.b +
      (
        b.b -
        a.b
      ) * t
  });
}

function colorLuminance(
  hex
) {
  const {
    r,
    g,
    b
  } =
    hexToRgb(
      hex
    );

  const transform =
    value => {
      const v =
        value / 255;

      return v <= 0.03928
        ? v / 12.92
        : Math.pow(
            (
              v +
              0.055
            ) / 1.055,
            2.4
          );
    };

  return (
    transform(r) *
      0.2126 +
    transform(g) *
      0.7152 +
    transform(b) *
      0.0722
  );
}

function readableTextColor(
  background
) {
  return colorLuminance(
    background
  ) > 0.46
    ? '#102033'
    : '#ffffff';
}

/*
 * مولد ثيم ذكي من لون واحد.
 * يبني Light و Dark مع الحفاظ على contrast مناسب.
 */
export function generateSmartPalette(
  baseColor,
  mode = 'light'
) {
  const base =
    /^#[0-9a-fA-F]{6}$/.test(
      String(
        baseColor
      )
    )
      ? baseColor
      : '#0b2f63';

  const white =
    '#ffffff';

  const darkBase =
    mixColors(
      base,
      '#071426',
      0.68
    );

  const blueGray =
    mixColors(
      base,
      '#718096',
      0.64
    );

  if (
    mode === 'dark'
  ) {
    const bgPrimary =
      mixColors(
        darkBase,
        '#05090f',
        0.30
      );

    const bgSecondary =
      mixColors(
        darkBase,
        '#111827',
        0.30
      );

    const surface =
      mixColors(
        base,
        '#162235',
        0.72
      );

    const border =
      mixColors(
        base,
        '#6b7d93',
        0.74
      );

    const accent =
      mixColors(
        base,
        white,
        0.25
      );

    const accentStrong =
      mixColors(
        base,
        white,
        0.42
      );

    const accentSoft =
      mixColors(
        base,
        bgPrimary,
        0.52
      );

    return {
      bgPrimary,
      bgSecondary,
      surface,
      surfaceHover:
        mixColors(
          surface,
          accent,
          0.18
        ),

      textPrimary:
        '#f5f8fc',
      textSecondary:
        mixColors(
          '#ffffff',
          blueGray,
          0.34
        ),
      textMuted:
        mixColors(
          '#ffffff',
          blueGray,
          0.60
        ),

      border,
      accent,
      accentStrong,
      accentSoft,

      danger:
        '#ef6a67',
      dangerSoft:
        mixColors(
          '#ef6a67',
          bgPrimary,
          0.76
        ),

      topbarBg:
        bgSecondary,
      topbarText:
        readableTextColor(
          bgSecondary
        ),
      sidebarBg:
        mixColors(
          bgSecondary,
          surface,
          0.22
        ),
      reminderPanelBg:
        mixColors(
          bgSecondary,
          surface,
          0.18
        ),

      calendarCardBg:
        surface,
      calendarGridLine:
        border,
      calendarDayText:
        '#f5f8fc',
      calendarWeekdayText:
        mixColors(
          '#ffffff',
          blueGray,
          0.30
        ),
      calendarWeekdayBg:
        mixColors(
          surface,
          accent,
          0.10
        ),
      calendarWeekdayBorder:
        border,
      calendarMonthText:
        '#ffffff',
      calendarSubtitleText:
        mixColors(
          '#ffffff',
          blueGray,
          0.48
        ),

      calendarSelectedBg:
        accentSoft,
      calendarSelectedText:
        readableTextColor(
          accentSoft
        ),

      calendarTodayBg:
        accent,
      calendarTodayText:
        readableTextColor(
          accent
        ),

      dateHeaderBg:
        mixColors(
          surface,
          accent,
          0.16
        ),
      dateHeaderBorder:
        accentStrong,
      dateHeaderText:
        mixColors(
          accentStrong,
          white,
          0.28
        ),

      clockBg:
        surface,
      clockText:
        accentStrong,

      reminderPending:
        accentStrong,
      reminderPartial:
        '#60a5fa',
      reminderDone:
        '#4ade80',

      converterHijri:
        '#56d49b'
    };
  }

  const bgPrimary =
    mixColors(
      base,
      white,
      0.955
    );

  const bgSecondary =
    mixColors(
      base,
      white,
      0.985
    );

  const border =
    mixColors(
      base,
      white,
      0.84
    );

  const accent =
    mixColors(
      base,
      '#071426',
      0.12
    );

  const accentStrong =
    mixColors(
      base,
      '#06152b',
      0.30
    );

  const accentSoft =
    mixColors(
      base,
      white,
      0.89
    );

  const textPrimary =
    mixColors(
      base,
      '#071426',
      0.58
    );

  return {
    bgPrimary,
    bgSecondary,
    surface:
      '#ffffff',
    surfaceHover:
      mixColors(
        base,
        white,
        0.93
      ),

    textPrimary,
    textSecondary:
      mixColors(
        textPrimary,
        blueGray,
        0.52
      ),
    textMuted:
      mixColors(
        textPrimary,
        white,
        0.48
      ),

    border,
    accent,
    accentStrong,
    accentSoft,

    danger:
      '#d84f4f',
    dangerSoft:
      '#f8e6e6',

    topbarBg:
      '#ffffff',
    topbarText:
      readableTextColor(
        '#ffffff'
      ),
    sidebarBg:
      mixColors(
        base,
        white,
        0.975
      ),
    reminderPanelBg:
      mixColors(
        base,
        white,
        0.975
      ),

    calendarCardBg:
      '#ffffff',
    calendarGridLine:
      border,
    calendarDayText:
      textPrimary,
    calendarWeekdayText:
      mixColors(
        textPrimary,
        blueGray,
        0.38
      ),
    calendarWeekdayBg:
      mixColors(
        base,
        white,
        0.94
      ),
    calendarWeekdayBorder:
      mixColors(
        base,
        white,
        0.82
      ),
    calendarMonthText:
      textPrimary,
    calendarSubtitleText:
      mixColors(
        textPrimary,
        white,
        0.42
      ),

    calendarSelectedBg:
      accentSoft,
    calendarSelectedText:
      textPrimary,

    calendarTodayBg:
      accent,
    calendarTodayText:
      readableTextColor(
        accent
      ),

    dateHeaderBg:
      mixColors(
        base,
        white,
        0.96
      ),
    dateHeaderBorder:
      accent,
    dateHeaderText:
      accentStrong,

    clockBg:
      '#ffffff',
    clockText:
      accent,

    reminderPending:
      mixColors(
        base,
        '#2563eb',
        0.28
      ),
    reminderPartial:
      '#3b82f6',
    reminderDone:
      '#1f9d68',

    converterHijri:
      '#19745f'
  };
}

export function createSavedTheme({
  name,
  baseColor,
  lightPalette,
  darkPalette
}) {
  return {
    id:
      `theme-${Date.now()}-${Math.random()
        .toString(36)
        .slice(
          2,
          7
        )}`,

    name:
      String(
        name ||
        'ثيم مخصص'
      ).trim() ||
      'ثيم مخصص',

    baseColor,

    light: {
      ...lightPalette
    },

    dark: {
      ...darkPalette
    },

    createdAt:
      new Date().toISOString()
  };
}


export function exportAppBackup({
  settings,
  reminders,
  exceptions,
  completed
}) {
  const payload = {
    version: 1,
    exportedAt:
      new Date().toISOString(),
    settings,
    reminders,
    exceptions,
    completed
  };

  const blob =
    new Blob(
      [
        JSON.stringify(
          payload,
          null,
          2
        )
      ],
      {
        type:
          'application/json'
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const anchor =
    document.createElement(
      'a'
    );

  anchor.href = url;
  anchor.download =
    `GPT-Dual-Calendar-Backup-${new Date()
      .toISOString()
      .slice(
        0,
        10
      )}.json`;

  anchor.click();

  URL.revokeObjectURL(
    url
  );
}

export function formatAppTime(
  time,
  timeFormat = '24'
) {
  if (
    timeFormat !== '12'
  ) {
    return time;
  }

  const [
    hourValue,
    minute = '00'
  ] =
    String(
      time || '00:00'
    ).split(':');

  let hour =
    Number(
      hourValue
    );

  const period =
    hour >= 12
      ? 'م'
      : 'ص';

  hour =
    hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
}

export function formatAppNumber(
  value,
  style = 'western'
) {
  const text =
    String(value);

  if (
    style !== 'arabic'
  ) {
    return text;
  }

  const map = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩'
  };

  return text.replace(
    /\d/g,
    digit =>
      map[digit] ||
      digit
  );
}

export function normalizeAppDigits(
  value
) {
  const map = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9'
  };

  return String(
    value ?? ''
  ).replace(
    /[٠-٩۰-۹]/g,
    char =>
      map[char] || char
  );
}
