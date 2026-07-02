/**
 * mockServer — "שרת" דמו בתוך הדפדפן שמממש את חוזה ה-REST (docs/API.md)
 * מעל נתוני data/mock.js, עם השהיית רשת מדומה ומצב שנשמר לאורך הסשן
 * (למשל: תור שנקבע באשף מופיע מיד ב"התורים שלי").
 *
 * למה זה קיים: כל שכבת הלקוח (services → apiClient → context/דפים) רצה
 * בקוד production אמיתי. כשהשרת האמיתי ימומש — מציבים VITE_API_MODE=server
 * והקובץ הזה יוצא מהמשחק בלי לגעת בשום דף.
 *
 * ⚠️ אבטחה: אימות סיסמאות אמיתי מתבצע אך ורק בשרת (bcrypt). מצב הדמו
 * מקבל כל סיסמה לא-ריקה לחשבונות הדמו, ומחזיר טוקן דמו לא-חתום — זהו
 * מנגנון תצוגה בלבד, לא מנגנון אבטחה.
 */

import {
  departments,
  doctors,
  timeSlots,
  appointments as seedAppointments,
  medicalRecord,
  doctorAgenda,
  adminStats,
  directoryUsers,
  currentPatient,
  currentDoctor,
  currentAdmin,
} from "../data/mock";

const HE_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

/* ----------------------- מצב הסשן (in-memory DB) ----------------------- */

const db = {
  appointments: seedAppointments.map((a) => ({ ...a })),
  documents: medicalRecord.documents.map((d) => ({ ...d })),
  users: directoryUsers.map((u) => ({ ...u })),
  booked: new Set(), // `${doctorId}|${date}|${time}` — למניעת double-booking
  registered: [], // משתמשים שנרשמו בדמו (חיים עד רענון)
};

/** חשבונות דמו — התחברות מהירה לכל תפקיד. */
const DEMO_ACCOUNTS = [
  { ...currentPatient, email: "israel@clinic.test" },
  { id: currentDoctor.id, fullName: currentDoctor.fullName, initial: currentDoctor.initial, role: "doctor", email: "levi@clinic.test" },
  { id: currentAdmin.id, fullName: currentAdmin.fullName, initial: currentAdmin.initial, role: "admin", email: "admin@clinic.test" },
];

/* ------------------------------- עזרים ------------------------------- */

const delay = () => new Promise((r) => setTimeout(r, 200 + Math.random() * 250));
const ok = (data, status = 200) => ({ status, data });
const err = (status, message) => ({ status, data: { message } });

const allUsers = () => [...DEMO_ACCOUNTS, ...db.registered];

/** טוקן דמו (payload גלוי בכוונה — בשרת אמיתי JWT חתום). */
const signToken = (u) => `demo.${btoa(JSON.stringify({ sub: u.id, role: u.role }))}.sig`;

function userFromToken(token) {
  try {
    const { sub } = JSON.parse(atob(String(token).split(".")[1]));
    return allUsers().find((u) => u.id === sub) ?? null;
  } catch {
    return null;
  }
}

const FACTORS = { month: 1, quarter: 3, year: 12 };

/* ------------------------------ Router ------------------------------ */

/**
 * מטפל בבקשת mock. מוחזר { status, data } — apiClient מתרגם ל-ApiError בכשל.
 * @param {{method:string, path:string, body:any, token:string|null}} req
 */
export async function handleMockRequest({ method, path, body, token }) {
  await delay();
  const url = new URL(path, "http://mock.local");
  const p = url.pathname;
  const q = url.searchParams;
  const M = method.toUpperCase();

  // לוג בקשות בפיתוח בלבד — לאיתור בקשות כפולות/מיותרות (לא רץ ב-build)
  if (import.meta.env.DEV) console.debug(`[mock] ${M} ${path}`);

  /* ---------- Auth ---------- */
  if (M === "POST" && p === "/auth/login") {
    const { email, password } = body ?? {};
    const user = allUsers().find((u) => u.email === email);
    // הודעה גנרית בכוונה — לא חושפים אם המייל קיים במערכת
    if (!user || !password) return err(401, "דוא״ל או סיסמה שגויים");
    return ok({ token: signToken(user), user });
  }

  if (M === "POST" && p === "/auth/register") {
    const { fullName, email } = body ?? {};
    if (allUsers().some((u) => u.email === email)) return err(409, "כתובת הדוא״ל כבר רשומה במערכת");
    const user = {
      id: Date.now(),
      fullName: fullName?.trim() || "מטופל/ת",
      initial: (fullName?.trim() || "מ")[0],
      role: "patient",
      email,
    };
    db.registered.push(user);
    return ok({ token: signToken(user), user }, 201);
  }

  if (M === "GET" && p === "/auth/me") {
    const user = userFromToken(token);
    if (!user) return err(401, "ההתחברות פגה — יש להתחבר מחדש");
    return ok({ user });
  }

  /* ---------- Departments ---------- */
  if (M === "GET" && p === "/departments") return ok(departments);

  /* ---------- Doctors ---------- */
  if (M === "GET" && p === "/doctors") {
    const deptId = Number(q.get("departmentId"));
    return ok(deptId ? doctors.filter((d) => d.departmentId === deptId) : doctors);
  }

  if (M === "GET" && p === "/doctors/me/agenda") return ok(doctorAgenda);
  if (M === "PUT" && p === "/doctors/me/availability") return ok({ saved: true });
  if (M === "PUT" && p === "/doctors/me") return ok({ ...body, saved: true });

  const availMatch = p.match(/^\/doctors\/(\d+)\/availability$/);
  if (M === "GET" && availMatch) {
    const doctorId = Number(availMatch[1]);
    const date = q.get("date");
    const withTaken = (list) =>
      list.map((s) => ({ ...s, taken: s.taken || db.booked.has(`${doctorId}|${date}|${s.time}`) }));
    return ok({ morning: withTaken(timeSlots.morning), afternoon: withTaken(timeSlots.afternoon) });
  }

  /* ---------- Appointments ---------- */
  if (M === "GET" && p === "/appointments") {
    const status = q.get("status");
    return ok(status ? db.appointments.filter((a) => a.status === status) : db.appointments);
  }

  if (M === "POST" && p === "/appointments") {
    const { doctorId, departmentId, date, time, reason } = body ?? {};
    const key = `${doctorId}|${date}|${time}`;
    if (db.booked.has(key)) return err(409, "החלון נתפס זה עתה — יש לבחור מועד אחר");
    const doc = doctors.find((d) => d.id === doctorId);
    const dept = departments.find((d) => d.id === departmentId);
    const [, mm, dd] = String(date).split("-");
    const appt = {
      id: Date.now(),
      day: String(Number(dd)),
      month: HE_MONTHS[Number(mm) - 1] ?? "",
      doctor: doc?.name ?? "",
      department: dept?.name ?? "",
      meta: `${time} · חדר ${doc?.room ?? "—"}`,
      status: "scheduled",
      reason: reason ?? "",
    };
    db.booked.add(key);
    db.appointments.unshift(appt);
    return ok(appt, 201);
  }

  const apptMatch = p.match(/^\/appointments\/(\d+)$/);
  if (M === "PATCH" && apptMatch) {
    const appt = db.appointments.find((a) => a.id === Number(apptMatch[1]));
    if (!appt) return err(404, "התור לא נמצא");
    if (body?.status === "cancelled" && appt.status !== "scheduled")
      return err(422, "ניתן לבטל רק תור מתוכנן");
    appt.status = body?.status ?? appt.status;
    return ok(appt);
  }

  /* ---------- Medical record / documents / visits ---------- */
  if (M === "GET" && /^\/patients\/\d+\/record$/.test(p)) {
    return ok({
      patient: medicalRecord.patient,
      visits: medicalRecord.visits,
      prescriptions: medicalRecord.prescriptions,
      documents: db.documents,
    });
  }

  if (M === "POST" && p === "/documents") {
    const name =
      (typeof FormData !== "undefined" && body instanceof FormData ? body.get("name") : body?.name) ||
      `מסמך_${db.documents.length + 1}.pdf`;
    const doc = {
      id: Date.now(),
      name,
      kind: /\.(jpe?g|png)$/i.test(name) ? "image" : "pdf",
      meta: `${new Date().toLocaleDateString("he-IL")} · 320KB`,
    };
    db.documents.unshift(doc);
    return ok(doc, 201);
  }

  if (M === "POST" && p === "/visits") return ok({ id: Date.now(), ...body }, 201);

  /* ---------- Admin ---------- */
  if (M === "GET" && p === "/admin/stats") {
    const f = FACTORS[q.get("range") ?? "month"] ?? 1;
    return ok({
      total: 1248 * f,
      cards: [
        { id: "total", label: "סה״כ תורים", value: 1248 * f, unit: "", delta: "▲ 12%", deltaUp: true },
        { id: "cancel", label: "אחוז ביטולים", value: 6.4, unit: "%", delta: "▼ 1.2%", deltaUp: true },
        { id: "patients", label: "מטופלים פעילים", value: Math.round(842 * (1 + (f - 1) * 0.25)), unit: "", delta: "▲ 5%", deltaUp: true },
        { id: "doctors", label: "רופאים פעילים", value: 23, unit: "", delta: "▲ 2", deltaUp: true },
      ],
      byDepartment: adminStats.byDepartment
        .map((d) => ({ ...d, value: Math.round(d.value * f) }))
        .sort((a, b) => b.value - a.value),
      statusBreakdown: adminStats.statusBreakdown,
      loadByDoctor: adminStats.loadByDoctor.map((d) => ({ ...d, value: Math.round(d.value * f) })),
    });
  }

  /* ---------- Users ---------- */
  if (M === "GET" && p === "/users") return ok(db.users);
  if (M === "PUT" && p === "/users/me") return ok({ ...body, saved: true });

  const userMatch = p.match(/^\/users\/(\d+)$/);
  if (M === "PATCH" && userMatch) {
    const targetId = Number(userMatch[1]);
    const user = db.users.find((u) => u.id === targetId);
    if (!user) return err(404, "המשתמש לא נמצא");
    // 🔒 הגנה מנעילה-עצמית: אסור להשבית את החשבון שמבצע את הבקשה.
    // כלל זהה חייב להיאכף גם בשרת האמיתי (user.service).
    const requester = userFromToken(token);
    if (body?.status === "disabled" && requester?.id === targetId) {
      return err(422, "לא ניתן להשבית את החשבון שבו את/ה מחובר/ת");
    }
    Object.assign(user, body);
    return ok(user);
  }

  return err(404, `mock: אין מסלול ${M} ${p}`);
}
