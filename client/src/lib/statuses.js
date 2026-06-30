/**
 * statuses.js — מטא-דאטה לסטטוסי תור.
 * הצבעים תואמים בדיוק לטוקנים ולטבלת ה-StatusBadge ב-README של ההנדאוף.
 * הרכיב StatusBadge והפילטרים ב-AppointmentsPage צורכים את האובייקט הזה.
 */

export const APPOINTMENT_STATUS = {
  scheduled: {
    key: "scheduled",
    label: "מתוכנן",
    ink: "var(--brand-ink)",
    soft: "var(--brand-soft)",
    dot: "var(--brand)",
  },
  completed: {
    key: "completed",
    label: "הושלם",
    ink: "var(--green-ink)",
    soft: "var(--green-soft)",
    dot: "var(--green)",
  },
  cancelled: {
    key: "cancelled",
    label: "בוטל",
    ink: "var(--accent-ink)",
    soft: "var(--accent-soft)",
    dot: "var(--accent)",
  },
  no_show: {
    key: "no_show",
    label: "לא הגיע",
    ink: "var(--amber-ink)",
    soft: "var(--amber-soft)",
    dot: "var(--amber)",
  },
};

/** סדר ההצגה בצ׳יפים של הפילטר (מסך "התורים שלי"). */
export const STATUS_ORDER = ["scheduled", "completed", "cancelled", "no_show"];

/** שליפה בטוחה של מטא לסטטוס נתון. */
export const statusMeta = (key) => APPOINTMENT_STATUS[key] ?? APPOINTMENT_STATUS.scheduled;
