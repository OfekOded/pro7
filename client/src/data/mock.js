/**
 * data/mock.js — נתוני דמו (mock) שמזינים את כל הדפים בשלב העיצוב.
 *
 * ⚠️ זמני: כל הנתונים כאן קבועים ומיועדים אך ורק להצגת ה-UI ללא שרת.
 * כשהשותף יחבר את ה-Backend, יש להחליף את הצריכה של הקובץ הזה בקריאות
 * דרך שכבת ה-services (client/src/services/*) שמושכת מה-REST API.
 * המבנה כאן תוכנן לשקף את סכמת ה-DB (ראו server/src/db/schema.sql).
 */

/* ----------------------------- משתמשים ----------------------------- */

export const currentPatient = {
  id: 1,
  fullName: "ישראל ישראלי",
  initial: "י",
  role: "patient",
  email: "israel@example.com",
  phone: "050-1234567",
  nationalId: "•••••••12",
  age: 34,
  bloodType: "A+",
  allergies: ["פניצילין", "אבקנים"],
};

export const currentDoctor = {
  id: 11,
  fullName: "ד״ר רונית לוי",
  initial: "ר",
  role: "doctor",
  specialty: "קרדיולוגיה",
  room: "204",
};

export const currentAdmin = {
  id: 99,
  fullName: "מערכת ניהול",
  initial: "מ",
  role: "admin",
};

/* ----------------------------- מחלקות ----------------------------- */

export const departments = [
  { id: 1, name: "קרדיולוגיה", icon: "heart", doctorsCount: 4 },
  { id: 2, name: "עור", icon: "droplet", doctorsCount: 3 },
  { id: 3, name: "אורתופדיה", icon: "activity", doctorsCount: 5 },
  { id: 4, name: "עיניים", icon: "search", doctorsCount: 2 },
  { id: 5, name: "רפואה פנימית", icon: "stethoscope", doctorsCount: 6 },
  { id: 6, name: "אף-אוזן-גרון", icon: "user", doctorsCount: 3 },
];

/* ----------------------------- רופאים ----------------------------- */

export const doctors = [
  {
    id: 11,
    name: "ד״ר רונית לוי",
    initial: "ר",
    departmentId: 1,
    specialty: "קרדיולוגיה",
    room: "204",
    availability: "free", // free | busy
    nextSlot: "היום 09:20",
  },
  {
    id: 12,
    name: "ד״ר שירה כהן",
    initial: "ש",
    departmentId: 1,
    specialty: "קרדיולוגיה",
    room: "206",
    availability: "busy",
    nextSlot: "מחר 11:40",
  },
  {
    id: 13,
    name: "ד״ר משה שרון",
    initial: "מ",
    departmentId: 2,
    specialty: "עור",
    room: "112",
    availability: "free",
    nextSlot: "היום 13:00",
  },
  {
    id: 14,
    name: "ד״ר אורי גל",
    initial: "א",
    departmentId: 3,
    specialty: "אורתופדיה",
    room: "301",
    availability: "free",
    nextSlot: "ראשון 08:30",
  },
];

/** רופאים לפי מחלקה — מדמה GET /doctors?departmentId=. */
export const doctorsByDepartment = (departmentId) =>
  doctors.filter((d) => d.departmentId === departmentId);

/* --------------------- אשף הזימון: לוח ושעות --------------------- */

/** ימי החודש להדגמה. state: available | full | selected(נקבע ב-UI) | empty */
export const calendarMonth = {
  label: "יולי 2026",
  weekDays: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
  // 0 = ריק (חודש קודם/הבא), אחרת מספר היום עם סטטוס
  days: [
    { day: 1, state: "available" },
    { day: 2, state: "available" },
    { day: 3, state: "full" },
    { day: 4, state: "available" },
    { day: 5, state: "available" },
    { day: 6, state: "available" },
    { day: 7, state: "full" },
    { day: 8, state: "available" },
    { day: 9, state: "available" },
    { day: 10, state: "available" },
    { day: 11, state: "available" },
    { day: 12, state: "available" },
    { day: 13, state: "available" },
    { day: 14, state: "full" },
    { day: 15, state: "available" },
    { day: 16, state: "available" },
    { day: 17, state: "available" },
    { day: 18, state: "available" },
  ],
};

/** חלונות שעה מקובצים — מדמה GET /doctors/:id/availability?date=. */
export const timeSlots = {
  morning: [
    { time: "08:00", taken: false },
    { time: "08:20", taken: true },
    { time: "08:40", taken: false },
    { time: "09:00", taken: false },
    { time: "09:20", taken: false },
    { time: "09:40", taken: true },
    { time: "10:00", taken: false },
    { time: "10:20", taken: false },
    { time: "10:40", taken: false },
  ],
  afternoon: [
    { time: "12:00", taken: false },
    { time: "12:20", taken: false },
    { time: "12:40", taken: true },
    { time: "13:00", taken: false },
    { time: "13:20", taken: false },
    { time: "13:40", taken: false },
    { time: "14:00", taken: true },
    { time: "14:20", taken: false },
    { time: "14:40", taken: false },
  ],
};

export const SLOT_MINUTES = 20;

/* ----------------------- תורים (מטופל) ----------------------- */

/** התור הקרוב — כרטיס ה-hero בדשבורד. */
export const nextAppointment = {
  id: 101,
  doctor: "ד״ר רונית לוי",
  department: "קרדיולוגיה",
  dateLabel: "ראשון, 12 ביולי",
  time: "09:20",
  room: "204",
  countdown: "בעוד 3 ימים",
};

/** כל התורים של המטופל — מסך "התורים שלי". */
export const appointments = [
  {
    id: 101,
    day: "12",
    month: "יולי",
    doctor: "ד״ר רונית לוי",
    department: "קרדיולוגיה",
    meta: "ראשון · 09:20 · חדר 204",
    status: "scheduled",
  },
  {
    id: 102,
    day: "24",
    month: "יולי",
    doctor: "ד״ר משה שרון",
    department: "עור",
    meta: "חמישי · 11:00 · חדר 112",
    status: "scheduled",
  },
  {
    id: 103,
    day: "28",
    month: "יוני",
    doctor: "ד״ר רונית לוי",
    department: "קרדיולוגיה",
    meta: "בדיקת מעקב · 09:00",
    status: "completed",
  },
  {
    id: 104,
    day: "15",
    month: "יוני",
    doctor: "ד״ר אורי גל",
    department: "אורתופדיה",
    meta: "בוטל ע״י המטופל · 13:40",
    status: "cancelled",
  },
  {
    id: 105,
    day: "2",
    month: "יוני",
    doctor: "ד״ר שירה כהן",
    department: "קרדיולוגיה",
    meta: "לא הגיע · 10:20",
    status: "no_show",
  },
];

/* ----------------------- תיק רפואי ----------------------- */

export const medicalRecord = {
  patient: currentPatient,
  visits: [
    {
      id: 201,
      doctor: "ד״ר רונית לוי",
      department: "קרדיולוגיה",
      dateLabel: "28 ביוני 2026",
      diagnosis: "לחץ דם גבולי",
      summary: "בדיקת מעקב שגרתית. הומלץ על שינוי תזונתי ומעקב חודשי.",
      prescriptionsCount: 1,
      documentsCount: 2,
    },
    {
      id: 202,
      doctor: "ד״ר משה שרון",
      department: "עור",
      dateLabel: "14 במאי 2026",
      diagnosis: "דרמטיטיס קל",
      summary: "טיפול מקומי במשחה. מעקב לפי הצורך.",
      prescriptionsCount: 1,
      documentsCount: 0,
    },
  ],
  prescriptions: [
    { id: 301, name: "אומפרזול", dosage: "20mg · פעם ביום", active: true },
    { id: 302, name: "ויטמין D", dosage: "1000IU · פעם ביום", active: true },
    { id: 303, name: "אמוקסיצילין", dosage: "500mg · 3 פעמים ביום", active: false },
  ],
  documents: [
    { id: 401, name: "בדיקת דם.pdf", kind: "pdf", meta: "28.6.2026 · 240KB" },
    { id: 402, name: "אק״ג.jpg", kind: "image", meta: "28.6.2026 · 1.2MB" },
  ],
};

/* ----------------------- אג׳נדת רופא/ה ----------------------- */

export const doctorAgenda = {
  greeting: "בוקר טוב, ד״ר לוי",
  dateLabel: "יום ראשון, 9 ביולי 2026",
  stats: [
    { id: "today", label: "תורים היום", value: 8, icon: "calendar", tone: "brand" },
    { id: "done", label: "הושלמו", value: 3, icon: "checkCircle", tone: "green" },
    { id: "waiting", label: "ממתינים", value: 4, icon: "clock", tone: "amber" },
    { id: "noshow", label: "לא הגיעו", value: 1, icon: "x", tone: "accent" },
  ],
  nextPatient: {
    name: "דנה אברהם",
    time: "09:20",
    reason: "כאבים בחזה — בדיקת מעקב",
  },
  timeline: [
    { time: "08:40", name: "יוסי כהן", reason: "בדיקת לחץ דם", state: "done" },
    { time: "09:00", name: "רותם בר", reason: "מעקב כולסטרול", state: "done" },
    { time: "09:20", name: "דנה אברהם", reason: "כאבים בחזה", state: "now" },
    { time: "09:40", name: "מיכל לוי", reason: "התייעצות", state: "upcoming" },
    { time: "10:00", name: "אבי נחום", reason: "בדיקה תקופתית", state: "upcoming" },
    { time: "10:20", name: "שרה דוד", reason: "מעקב תרופתי", state: "upcoming" },
  ],
};

/* ----------------------- מסך ביקור ----------------------- */

export const visitContext = {
  patient: {
    name: "דנה אברהם",
    initial: "ד",
    age: 41,
    nationalId: "•••••••48",
    appointmentTime: "09:20",
  },
  vitals: [
    { label: "לחץ דם", value: "128/84", icon: "activity" },
    { label: "דופק", value: "72", icon: "heart" },
    { label: "משקל", value: "68 ק״ג", icon: "chart" },
    { label: "סוג דם", value: "O+", icon: "droplet" },
  ],
  allergies: ["פניצילין"],
  recentVisits: [
    { dateLabel: "12 במאי 2026", summary: "מעקב לחץ דם — תקין" },
    { dateLabel: "3 בפברואר 2026", summary: "בדיקה תקופתית" },
  ],
};

/* ----------------------- דשבורד מנהל/ת ----------------------- */

export const adminStats = {
  ranges: ["חודש", "רבעון", "שנה"],
  cards: [
    { id: "total", label: "סה״כ תורים", value: "1,248", delta: "▲ 12%", deltaUp: true },
    { id: "cancel", label: "אחוז ביטולים", value: "6.4%", delta: "▼ 1.2%", deltaUp: true },
    { id: "patients", label: "מטופלים פעילים", value: "842", delta: "▲ 5%", deltaUp: true },
    { id: "doctors", label: "רופאים פעילים", value: "23", delta: "▲ 2", deltaUp: true },
  ],
  // תורים לפי מחלקה — לגרף עמודות
  byDepartment: [
    { label: "קרדיו׳", value: 320 },
    { label: "עור", value: 210 },
    { label: "אורתו׳", value: 280 },
    { label: "עיניים", value: 140 },
    { label: "פנימית", value: 360 },
    { label: "אא״ג", value: 160 },
  ],
  // התפלגות סטטוס — לגרף דונאט
  statusBreakdown: [
    { key: "completed", label: "הושלם", value: 74, color: "var(--green)" },
    { key: "scheduled", label: "מתוכנן", value: 13, color: "var(--brand)" },
    { key: "cancelled", label: "בוטל", value: 8, color: "var(--accent)" },
    { key: "no_show", label: "לא הגיע", value: 5, color: "var(--amber)" },
  ],
  // עומס לפי רופא/ה — לגרף פסים אופקיים
  loadByDoctor: [
    { name: "ד״ר רונית לוי", value: 92 },
    { name: "ד״ר משה שרון", value: 78 },
    { name: "ד״ר אורי גל", value: 64 },
    { name: "ד״ר שירה כהן", value: 51 },
  ],
};

/* ----------------------- ניהול (מנהל/ת) ----------------------- */

/** ספריית משתמשים — מסך ניהול המשתמשים. status: active | disabled. */
export const directoryUsers = [
  { id: 1, name: "ישראל ישראלי", initial: "י", role: "patient", email: "israel@clinic.test", phone: "050-1234567", status: "active" },
  { id: 2, name: "דנה אברהם", initial: "ד", role: "patient", email: "dana@clinic.test", phone: "052-2223344", status: "active" },
  { id: 3, name: "יוסי כהן", initial: "י", role: "patient", email: "yossi@clinic.test", phone: "054-9876543", status: "disabled" },
  { id: 11, name: "ד״ר רונית לוי", initial: "ר", role: "doctor", email: "levi@clinic.test", phone: "050-7654321", status: "active" },
  { id: 13, name: "ד״ר משה שרון", initial: "מ", role: "doctor", email: "sharon@clinic.test", phone: "050-1112222", status: "active" },
  { id: 14, name: "ד״ר אורי גל", initial: "א", role: "doctor", email: "gal@clinic.test", phone: "053-4445566", status: "active" },
  { id: 20, name: "מירי פקידה", initial: "מ", role: "receptionist", email: "desk@clinic.test", phone: "03-1112222", status: "active" },
  { id: 99, name: "מאיה אדמין", initial: "מ", role: "admin", email: "admin@clinic.test", phone: "03-0000000", status: "active" },
];

/** המטופלים של הרופא/ה המחובר/ת — מסך "המטופלים שלי". */
export const doctorPatients = [
  { id: 2, name: "דנה אברהם", initial: "ד", age: 41, condition: "יתר לחץ דם", lastVisit: "28 ביוני 2026", next: "12 ביולי" },
  { id: 3, name: "יוסי כהן", initial: "י", age: 57, condition: "מעקב כולסטרול", lastVisit: "14 במאי 2026", next: "—" },
  { id: 4, name: "רותם בר", initial: "ר", age: 34, condition: "בדיקה תקופתית", lastVisit: "3 במרץ 2026", next: "20 ביולי" },
  { id: 5, name: "מיכל לוי", initial: "מ", age: 62, condition: "אי-ספיקת לב קלה", lastVisit: "2 ביולי 2026", next: "9 ביולי" },
  { id: 6, name: "אבי נחום", initial: "א", age: 48, condition: "הפרעת קצב", lastVisit: "20 ביוני 2026", next: "—" },
  { id: 7, name: "שרה דוד", initial: "ש", age: 39, condition: "מעקב תרופתי", lastVisit: "10 ביוני 2026", next: "15 ביולי" },
];

/** זמינות שבועית ברירת-מחדל — מסך "יומן זמינות". weekday 0=ראשון. */
export const weeklyAvailability = [
  { weekday: 0, label: "ראשון", active: true, start: "08:00", end: "14:00" },
  { weekday: 1, label: "שני", active: true, start: "08:00", end: "16:00" },
  { weekday: 2, label: "שלישי", active: true, start: "09:00", end: "15:00" },
  { weekday: 3, label: "רביעי", active: true, start: "08:00", end: "14:00" },
  { weekday: 4, label: "חמישי", active: true, start: "08:00", end: "13:00" },
  { weekday: 5, label: "שישי", active: false, start: "08:00", end: "12:00" },
  { weekday: 6, label: "שבת", active: false, start: "00:00", end: "00:00" },
];
