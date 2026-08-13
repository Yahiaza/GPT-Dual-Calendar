UPDATE PATCH
============

انسخ الملفات داخل المشروع بنفس المسارات.

بعد النسخ افتح:
electron/update-config.cjs

وغيّر فقط:
owner: 'YOUR_GITHUB_USERNAME'

إلى اسم حسابك الحقيقي على GitHub.

وتأكد أن:
repo: 'GPT-Dual-Calendar'

هو نفس اسم Repository عندك. لو مختلف غيّره.

بعدها:
npm run dev

ثم:
الإعدادات > حول التطبيق > تحديث البرنامج > تحقق من تحديث

النظام:
- يقرأ آخر GitHub Release.
- يقارن الإصدار مع app.getVersion().
- يبحث عن ملف ينتهي بـ Portable.exe.
- يعرض Release Notes.
- ينزّل الملف إلى Windows Downloads.
- يعرض Progress.
- بعد النهاية يمكن فتح مكان الملف.

مهم:
GitHub Repository يجب أن يحتوي Releases منشورة، وليس فقط commits.
