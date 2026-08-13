# GPT Dual Calendar

تطبيق Desktop مبني بـ React + Vite + Tailwind + Electron.

## المميزات

- تقويم ميلادي على اليمين.
- تقويم هجري على اليسار.
- الشهر الهجري يظهر كاملًا من 1 إلى 29/30.
- تنقل مستقل بالشهور والسنوات لكل تقويم.
- الضغط على أي يوم يزامن التاريخ المحدد بين الميلادي والهجري.
- زر التاريخ البرتقالي العلوي يرجع لليوم الحالي.
- ضبط التاريخ الهجري بـ - / 0 / +.
- Right Click على أي يوم لإضافة تذكير.
- تكرار يومي / أسبوعي / شهري / سنوي.
- نهاية التكرار دائمًا / حتى تاريخ / بعد عدد مرات.
- علامة تذكير على اليوم + Hover Popup لعناوين التذكيرات.
- صفحة مستقلة للتذكيرات.
- عرض / تعديل / حذف التذكير.
- حذف occurrence واحد أو هذا وما بعده أو السلسلة كاملة.
- حاسبة فرق بين تاريخين ميلادي أو هجري.
- Light theme عاجي + برتقالي.
- Dark theme رمادي + كحلي.
- خط Cairo.
- Windows Notifications عبر Electron.
- إعداد Portable EXE عبر electron-builder.

## التشغيل

```powershell
npm install
npm run dev
```

## بناء النسخة Portable

```powershell
npm run build
```

ستظهر الملفات الناتجة داخل:

```text
release/
```

## ملاحظة عن Cairo

الخط مضبوط كخط رسمي للتطبيق عبر Google Fonts مع fallback إلى Segoe UI عند عدم وجود اتصال.


## إذا ظهر خطأ index.css 500

النسخة الحالية تستخدم ملفات إعداد CommonJS:

- `postcss.config.cjs`
- `tailwind.config.cjs`

بعد استبدال النسخة القديمة احذف `node_modules` و `package-lock.json` ثم ثبّت الحزم من جديد:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm run dev
```


## Portable build بدون صلاحيات Admin

هذه النسخة تستخدم electron-builder 26.15.7، وتوقف توقيع ملفات Windows فقط مع إبقاء تعديل الأيقونة والـ metadata.

الطريقة الأسهل:

```powershell
.\build-portable.cmd
```

أو يدويًا:

```powershell
npm install
npm run build:portable
```

الناتج المتوقع:

```text
release\GPT-Dual-Calendar-1.0.0-Portable.exe
```


## Build version auto-increment

كل Build توزيعي يرفع رقم Patch تلقائيًا:

```text
1.0.0 -> 1.0.1 -> 1.0.2
```

الأوامر التي ترفع الإصدار تلقائيًا:

```powershell
npm run build
npm run build:portable
npm run build:unpacked
```

`build:renderer` لا يغيّر رقم الإصدار لأنه لا ينتج نسخة توزيعية.

## Faster single-file Portable

تم ضبط نسخة Portable على ضغط أخف و ZIP مع مجلد فك ثابت داخل TEMP لتقليل كلفة الفك قدر الإمكان:

- `compression: store`
- `portable.useZip: true`
- `portable.unpackDirName: GPTDualCalendarPortable`

هذا يجعل ملف Portable أكبر حجمًا، لكنه يفضّل سرعة الفك على صغر الحجم.
