# מודל הנתונים — מרפאה חכמה (MySQL)

ה-DDL המלא: [`server/src/db/schema.sql`](../server/src/db/schema.sql). נתוני דמו: [`seed.sql`](../server/src/db/seed.sql).

## ישויות ויחסים

```
users (4 roles) ──1:1──> doctors ──N:1──> departments
   │  │  │                  │
   │  │  │                  └──1:N──> doctor_availability
   │  │  └──(patient)──1:N──> appointments <──N:1── doctors
   │  │                          │
   │  │                          └──1:1──> visits ──1:N──> prescriptions
   │  └──────────1:N──────────────────────> documents <──(visit_id, nullable)
   └─────────────1:N──────────────────────> notifications
```

## טבלאות

| טבלה | תיאור | מפתחות זרים עיקריים |
|---|---|---|
| `users` | כל המשתמשים; `role` ∈ patient/receptionist/doctor/admin; `password_hash` (bcrypt); `national_id`/`email` ייחודיים | — |
| `departments` | מחלקות רפואיות (שם, slug, icon) | — |
| `doctors` | פרופיל רופא/ה המרחיב משתמש | `user_id`→users, `department_id`→departments |
| `doctor_availability` | חלונות זמינות שבועיים (weekday, start/end, slot_minutes) | `doctor_id`→doctors |
| `appointments` | תורים; `status` enum; **`UNIQUE(doctor_id, appt_date, appt_time)`** מונע double-booking | patient/doctor/department |
| `visits` | תיעוד ביקור (אבחנה, סיכום); `appointment_id` ייחודי | appointment/doctor/patient |
| `prescriptions` | מרשמים מקושרים לביקור; `active` | `visit_id`→visits, `patient_id`→users |
| `documents` | מטא של קבצים שהועלו (נתיב/mime/גודל) | patient/visit(nullable)/uploaded_by |
| `notifications` | התראות (רשות) — תזכורות/עדכונים | `user_id`→users |

## החלטות תכנון
- **מניעת double-booking**: אילוץ `UNIQUE` ברמת ה-DB + בדיקת זמינות בשירות (`appointment.service`).
- **תיק רפואי** = ביקורים + מרשמים + מסמכים של מטופל, מקושרים דרך `patient_id`.
- **קבצים** נשמרים בדיסק (`UPLOAD_DIR`); ב-DB רק מטא — לא ה-BLOB.
- **מחיקות**: `ON DELETE CASCADE` לישויות תלויות; `RESTRICT` למחלקות (לא למחוק מחלקה עם רופאים/תורים); `SET NULL` ל-`documents.visit_id`.
- charset `utf8mb4` לתמיכה מלאה בעברית/אמוג׳י.
