# מרפאה חכמה — מערכת ניהול מרפאה וזימון תורים

פרויקט גמר בקורס **Full-Stack Web Development** (המרכז האקדמי לב).
יישום end-to-end לניהול מרפאה: זימון תורים, תיק רפואי, ניהול ביקורים וניתוחים —
ב-RTL מלא, עם 4 סוגי משתמשים: **מטופל · פקיד/ת קבלה · רופא/ה · מנהל/ת**.

> **מצב נוכחי:** הפרונט (8 מסכים + ספריית רכיבים) **בנוי ועובד** על נתוני דמו (mock).
> שכבת ה-services, ה-AuthContext וכל ה-server הם **שלד עם TODOs מפורטים** לשלב הבא.

## מבנה (מונורפו)

```
.
├── client/   React 19 + Vite — דפים, רכיבים, ראוטינג, services (UI מלא, mock data)
├── server/   Node/Express — REST API ב-MVC + MySQL (שלד + schema.sql/seed.sql)
├── docs/     API.md · DATABASE.md · DESIGN.md · ARCHITECTURE.md
└── design_handoff_clinic_ui/   רפרנס העיצוב (מקור אמת)
```

## הרצה

**לקוח (מה שעובד עכשיו):**
```bash
cd client
npm install
npm run dev          # http://localhost:5173
```

**שרת (לאחר מימוש ה-TODOs):**
```bash
cd server
cp .env.example .env         # עדכון פרטי DB ו-JWT
npm install
npm run db:schema            # יצירת הסכמה ב-MySQL
npm run dev                  # http://localhost:4000
```

או מהשורש: `npm run client` · `npm run server` · `npm run install:all`.

## סטאק
- **לקוח**: React 19, Vite 8, react-router-dom 7, CSS Modules, אייקוני inline-SVG, oxlint.
- **שרת**: Express, mysql2, JWT, bcryptjs, multer, cors, morgan.
- **DB**: MySQL.

## תיעוד
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — סקירה ואיפה מחברים נתונים אמיתיים.
- [docs/API.md](docs/API.md) — חוזה ה-REST API.
- [docs/DATABASE.md](docs/DATABASE.md) — מודל הנתונים.
- [docs/DESIGN.md](docs/DESIGN.md) — מערכת העיצוב.
- `CLAUDE.md` — הנחיות לעבודה עם הקוד (לסוכן ולמפתחים).
