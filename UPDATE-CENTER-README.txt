GPT Dual Calendar - Update Center Patch
=======================================

هذا الباتش مبني خصيصًا على:
GPT-Dual-Calendar-Latest-Full-Project

ولا يحتوي على Theme Studio ولا يعتمد عليه.

GitHub Repository المستخدم:
https://github.com/Yahiaza/GPT-Dual-Calendar

الوظائف:
- فحص آخر GitHub Release.
- مقارنة الإصدار المنشور مع app.getVersion().
- فحص تلقائي صامت بعد فتح التطبيق.
- زر "تحقق الآن" داخل الإعدادات > حول التطبيق.
- عرض Release Notes.
- تنزيل Portable EXE إلى Windows Downloads.
- Progress أثناء التنزيل.
- فتح مكان الملف بعد التنزيل.
- دعم SHA-256 تلقائيًا إذا كان ملف .sha256 مرفوعًا مع الـRelease.
- إذا فشل SHA-256 يتم حذف الملف التالف.

مهم جدًا:
يجب أن يكون لديك GitHub Release منشور وليس Commit فقط.

داخل الـRelease ارفع ملفًا اسمه مثل:
GPT-Dual-Calendar-1.0.5-Portable.exe

ويمكن أيضًا رفع:
GPT-Dual-Calendar-1.0.5-Portable.exe.sha256

رقم Tag يفضل أن يكون:
v1.0.5

ويجب أن يكون أكبر من version الموجود في package.json للنسخة المثبتة.

للتجربة:
npm run dev

ثم:
الإعدادات
> حول التطبيق
> تحديث البرنامج
> تحقق الآن
