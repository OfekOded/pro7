# שרת — מרפאה חכמה (Node/Express)

REST API בארכיטקטורת **MVC** למערכת ניהול המרפאה. ⚠️ כרגע **שלד עם TODOs** —
הלוגיקה תמומש בשלב הבא (ראו ה-TODO בכל קובץ). `schema.sql` ו-`seed.sql` מוכנים.

## הרצה (לאחר מימוש)

```bash
cp .env.example .env        # ועדכון ערכים (DB, JWT)
npm install
npm run db:schema           # יצירת הסכמה ב-MySQL
npm run db:seed             # נתוני דמו (לאחר עדכון ה-hash בסיד)
npm run dev                 # nodemon על src/index.js
```

## מבנה (MVC)

```
src/
├── index.js        כניסה: env → DB → listen
├── app.js          הרכבת Express (middleware + ראוטים)
├── config/         env.js, db.js (pool)
├── routes/         הגדרת נתיבים (דק) → controllers
├── controllers/    קבלת בקשה/החזרת תשובה (דק)
├── services/       לוגיקה עסקית (זימון, זמינות, סגירת ביקור...)
├── models/         גישת נתונים (SQL מעל ה-pool)
├── middleware/     auth, requireRole, errorHandler, notFound, validate, upload
├── utils/          jwt, password, ApiError, asyncHandler
└── db/             schema.sql, seed.sql
```

זרימה: `route → middleware → controller → service → model → DB`.

## מקורות
- חוזה ה-API המלא: [`../docs/API.md`](../docs/API.md)
- מודל הנתונים: [`../docs/DATABASE.md`](../docs/DATABASE.md)
