# מערכת העיצוב — מרפאה חכמה

מקור האמת המלא נמצא ב-[`design_handoff_clinic_ui/README.md`](../design_handoff_clinic_ui/README.md)
ובקובץ `Clinic UI.dc.html` (ערכים מדויקים). מסמך זה מסכם איך העיצוב מיושם בקוד.

## טוקנים
כל הטוקנים מוגדרים כמשתני CSS ב-[`client/src/styles/tokens.css`](../client/src/styles/tokens.css)
ונצרכים בכל הרכיבים (אסור לקודד צבעים/מרווחים בקשיח).

- **צבעים**: `--brand #1E88B5` · `--teal #15A6A6` · `--green #1F9D74` · `--accent #E8654F` (אלמוג — פעולות ראשיות) · `--amber #C68A2E` · גווני ink/line/soft.
- **טיפוגרפיה**: Heebo (400–800). H1 30/800, H2 22/700, H3 17/700, גוף 15/400.
- **רדיוסים**: `--r-sm 10` · `--r 14` · `--r-lg 20` · גלולה 999.
- **צללים**: `--shadow`, `--shadow-sm`, צל אלמוג ל-CTA.
- **גרדיאנט מותג**: `linear-gradient(135deg, #1E88B5, #15A6A6)`.

## רכיבים (CSS Modules)
- ספריית UI: [`client/src/components/ui`](../client/src/components/ui) — Button, Input/Textarea/Field, Card, StatusBadge, Chip, Table, Alert, Avatar, FileUpload (Dropzone/FileRow), Stepper, Tabs, StatCard, Modal, EmptyState.
- גרפים (CSS טהור): [`client/src/components/charts`](../client/src/components/charts) — BarChart, DonutChart, HBarChart.
- מעטפות: [`client/src/components/layout`](../client/src/components/layout) — AppShell, Sidebar (מודע-תפקיד), Topbar, MobileBottomNav, AuthLayout.
- אייקונים: [`client/src/components/icons`](../client/src/components/icons) — סט inline-SVG (`<Icon name=… />`).

## עקרונות
- **RTL מלא** (`dir="rtl"` על ה-html). שדות LTR (אימייל/ת.ז/טלפון) מסומנים במחלקה `.ltr`.
- **רספונסיביות**: נקודת שבירה 768px. דסקטופ = סייד-בר קבוע; מובייל = בר ניווט תחתון (מטופל) / פריסה אנכית.
- **סטטוסי תור** עקביים דרך [`client/src/lib/statuses.js`](../client/src/lib/statuses.js).
- **ניווט לפי תפקיד** דרך [`client/src/lib/roles.js`](../client/src/lib/roles.js).

## 8 המסכים
התחברות (s1) · דשבורד מטופל (s2) · אשף זימון (s3) · רשימת תורים (s4) · תיק רפואי (s5) ·
אג׳נדת רופא/ה (s6) · מסך ביקור (s7) · דשבורד מנהל/ת (s8). כולם נבנו (דסקטופ + מובייל).
