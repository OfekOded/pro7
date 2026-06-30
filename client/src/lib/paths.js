/**
 * paths.js — מקור אמת יחיד לכל נתיבי הראוטינג באפליקציה.
 * משתמשים בקבועים האלה ב-<Route>, ב-<Link>, ובקונפיגורציית הניווט (roles.js)
 * כדי שלא יהיו מחרוזות נתיב "קסומות" מפוזרות בקוד.
 */

export const PATHS = {
  // ציבורי
  login: "/login",

  // מטופל
  patientDashboard: "/",
  book: "/book",
  appointments: "/appointments",
  record: "/record",
  patientProfile: "/profile",

  // רופא/ה
  doctorAgenda: "/doctor",
  doctorVisit: "/doctor/visit/:id",
  doctorPatients: "/doctor/patients",
  doctorAvailability: "/doctor/availability",
  doctorProfile: "/doctor/profile",

  // מנהל/ת
  adminDashboard: "/admin",
  adminUsers: "/admin/users",
  adminDoctors: "/admin/doctors",
  adminDepartments: "/admin/departments",
};

/** בונה נתיב ביקור עם מזהה תור קונקרטי. */
export const visitPath = (id) => `/doctor/visit/${id}`;
