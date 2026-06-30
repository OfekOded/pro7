/**
 * roles.js — סוגי המשתמשים וקונפיגורציית הניווט לכל תפקיד.
 * האפיון דורש לפחות 2 תפקידים; כאן מוגדרים 4 (מטופל, פקיד/ת קבלה, רופא/ה, מנהל/ת).
 *
 * שדה `icon` הוא מחרוזת-מפתח שממופה לרכיב אייקון ב-components/icons.
 * שדה `theme` קובע את צבע הפריט הפעיל בסייד-בר (כחול למטופל/מנהל, ירוק לרופא/ה),
 * בהתאם להנדאוף.
 */

export const ROLES = {
  patient: "patient",
  receptionist: "receptionist",
  doctor: "doctor",
  admin: "admin",
};

/** תווית עברית לתפקיד (לכרטיס המשתמש בסייד-בר וכו'). */
export const ROLE_LABEL = {
  patient: "מטופל",
  receptionist: "פקיד/ת קבלה",
  doctor: "רופא/ה",
  admin: "מנהל/ת",
};

/** ערכת צבע הניווט לכל תפקיד. */
export const ROLE_THEME = {
  patient: "brand",
  receptionist: "brand",
  doctor: "green",
  admin: "brand",
};

import { PATHS } from "./paths";

/** ניווט הסייד-בר (דסקטופ) לפי תפקיד. */
export const NAV_BY_ROLE = {
  patient: [
    { to: PATHS.patientDashboard, label: "דשבורד", icon: "grid", end: true },
    { to: PATHS.book, label: "זימון תור", icon: "calendarPlus" },
    { to: PATHS.appointments, label: "התורים שלי", icon: "clipboardCheck" },
    { to: PATHS.record, label: "תיק רפואי", icon: "fileText" },
    { to: PATHS.patientProfile, label: "פרופיל", icon: "user" },
  ],
  doctor: [
    { to: PATHS.doctorAgenda, label: "אג׳נדה", icon: "calendarClock", end: true },
    { to: PATHS.doctorPatients, label: "המטופלים שלי", icon: "users" },
    { to: PATHS.doctorAvailability, label: "יומן זמינות", icon: "calendarDays" },
    { to: PATHS.doctorProfile, label: "פרופיל", icon: "user" },
  ],
  admin: [
    { to: PATHS.adminDashboard, label: "דשבורד", icon: "chart", end: true },
    { to: PATHS.adminUsers, label: "משתמשים", icon: "users" },
    { to: PATHS.adminDoctors, label: "רופאים", icon: "stethoscope" },
    { to: PATHS.adminDepartments, label: "מחלקות", icon: "building" },
  ],
};

/** בר ניווט תחתון במובייל — מטופל בלבד (4 פריטים, לפי ההנדאוף). */
export const MOBILE_NAV_PATIENT = [
  { to: PATHS.patientDashboard, label: "דשבורד", icon: "grid", end: true },
  { to: PATHS.appointments, label: "תורים", icon: "calendarPlus" },
  { to: PATHS.record, label: "תיק", icon: "fileText" },
  { to: PATHS.patientProfile, label: "פרופיל", icon: "user" },
];
