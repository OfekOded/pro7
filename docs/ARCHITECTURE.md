# ארכיטקטורה — מרפאה חכמה

מונורפו פולסטאק: **client** (React/Vite) + **server** (Node/Express/MySQL).

```
[ Browser ]
   │  React (Vite) — pages + components + react-router
   │  services/* (fetch גנרי, JWT)  ──HTTP──┐
   ▼                                        ▼
[ client ]                            [ server ]  Express (MVC)
                                       route → middleware(auth/role) →
                                       controller → service → model → [ MySQL ]
                                                                  └─ uploads/ (multer)
```

## עקרונות
- **הפרדת אחריות**: ה-UI לא יודע על SQL; הוא מדבר רק עם `services/*` שמדברים עם ה-REST API.
- **MVC בשרת**: routes דקים → controllers דקים → services (לוגיקה) → models (SQL).
- **אימות/הרשאות**: JWT (`Authorization: Bearer`), middleware `auth` + `requireRole`.
- **מצב נוכחי**: הפרונט (דפים+רכיבים) בנוי על נתוני mock; כל ה-services/השרת הם שלד עם TODOs.

## איפה מחברים נתונים אמיתיים (שלב הלוגיקה)
1. לעטוף את `<App/>` ב-`<AuthProvider>` ולממש `AuthContext`/`useAuth`.
2. לממש את ה-server (config → models → services → controllers → routes → app/index).
3. בכל דף: להחליף את ה-import מ-`data/mock` בקריאה דרך `services/*` (למשל עם `useFetch`).
4. להפעיל `ProtectedRoute` (אימות + תפקיד) במקום ה-pass-through הנוכחי.

מסמכים קשורים: [API.md](API.md) · [DATABASE.md](DATABASE.md) · [DESIGN.md](DESIGN.md).

> TODO: להשלים דיאגרמת רצף לזרימת זימון התור (booking) מקצה לקצה לאחר מימוש השרת.
