# API — מרפאה חכמה (REST)

חוזה ה-API בין הלקוח לשרת. בסיס: `/{VITE_API_URL}` (למשל `http://localhost:4000/api`).
אימות: `Authorization: Bearer <JWT>` בכל נתיב מאומת. תשובות JSON.
שגיאות: `{ "message": "...", "details": ... }` עם קוד סטטוס מתאים.

תפקידים: `patient` · `receptionist` · `doctor` · `admin`.

---

## Auth
| Method | Path | גישה | גוף / פרמטרים | תשובה |
|---|---|---|---|---|
| POST | `/auth/register` | ציבורי | `{ fullName, nationalId, email, phone, password }` | `{ token, user }` (מטופלים בלבד) |
| POST | `/auth/login` | ציבורי | `{ email, password }` | `{ token, user }` |
| GET | `/auth/me` | מאומת | — | `{ user }` |

## Users
| Method | Path | גישה | הערות |
|---|---|---|---|
| GET | `/users` | admin | רשימת משתמשים (סינון `?role=`) |
| GET | `/users/me` | מאומת | המשתמש הנוכחי |
| PUT | `/users/me` | מאומת | עדכון פרטים אישיים |
| GET | `/users/:id` | admin | |
| PUT | `/users/:id` | admin | |
| DELETE | `/users/:id` | admin | |

## Departments
| Method | Path | גישה |
|---|---|---|
| GET | `/departments` | מאומת |
| POST | `/departments` | admin |
| PUT | `/departments/:id` | admin |
| DELETE | `/departments/:id` | admin |

## Doctors
| Method | Path | גישה | הערות |
|---|---|---|---|
| GET | `/doctors?departmentId=` | מאומת | רופאים לפי מחלקה (שלב 2 באשף) |
| GET | `/doctors/:id` | מאומת | |
| GET | `/doctors/:id/availability?date=YYYY-MM-DD` | מאומת | חלונות פנויים ליום (שלב 4 באשף) |
| GET | `/doctors/me/agenda?date=` | doctor | אג׳נדת היום + ספירות סטטוס |
| GET | `/doctors/me/availability` | doctor | |
| PUT | `/doctors/me/availability` | doctor | עדכון חלונות זמינות |

## Appointments
| Method | Path | גישה | גוף / הערות |
|---|---|---|---|
| GET | `/appointments?status=` | מאומת | מסונן לפי תפקיד (מטופל→שלו, רופא→שלו, פקיד/מנהל→הכל) |
| GET | `/appointments/:id` | מאומת | |
| POST | `/appointments` | patient | `{ doctorId, departmentId, date, time, reason? }` → מאמת זמינות (מונע double-booking) |
| PATCH | `/appointments/:id` | מאומת | `{ status }` — ביטול (`cancelled`) רק ב-`scheduled` ועד 24ש לפני |

## Visits
| Method | Path | גישה | גוף |
|---|---|---|---|
| POST | `/visits` | doctor | `{ appointmentId, diagnosis, summary, prescriptions?[] }` — "סגור ביקור": יוצר visit, מסמן תור `completed`, שומר מרשמים (transaction) |
| GET | `/visits/:id` | מאומת | |

## Prescriptions
| Method | Path | גישה |
|---|---|---|
| POST | `/prescriptions` | doctor |
| PATCH | `/prescriptions/:id` | doctor |
| DELETE | `/prescriptions/:id` | doctor |

## Documents (העלאת מדיה)
| Method | Path | גישה | הערות |
|---|---|---|---|
| POST | `/documents` | מאומת | `multipart/form-data`: `file` + `{ patientId, visitId? }` |
| GET | `/documents/:id` | מאומת | מטא/הורדה (בדיקת הרשאה) |
| DELETE | `/documents/:id` | מאומת | |

## Medical Record
| Method | Path | גישה | תשובה |
|---|---|---|---|
| GET | `/patients/:id/record` | מאומת (בעל התיק / רופא / מנהל) | `{ patient, visits[], prescriptions[], documents[] }` |

## Admin
| Method | Path | גישה | תשובה |
|---|---|---|---|
| GET | `/admin/stats?range=month\|quarter\|year` | admin | `{ cards, byDepartment, statusBreakdown, loadByDoctor }` (מבנה זהה ל-`client/src/data/mock.js` → `adminStats`) |

---

### מודל סטטוס תור
`scheduled` (מתוכנן) · `completed` (הושלם) · `cancelled` (בוטל) · `no_show` (לא הגיע).
תואם ל-`client/src/lib/statuses.js`.
