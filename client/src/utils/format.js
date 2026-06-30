/**
 * format.js — עזרי פורמט לתאריך/שעה/טקסט בעברית.
 *
 * ⚠️ חלקי: כרגע הדפים משתמשים במחרוזות מוכנות מ-data/mock. כשיגיעו נתונים
 *    אמיתיים מהשרת (תאריכים ISO), יש להשתמש בעזרים האלה (ולהשלים את ה-TODO).
 */

const HE_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

const HE_WEEKDAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

/** "2026-07-12" → "12 ביולי 2026" */
export function formatDateHe(iso) {
  const d = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ב${HE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "2026-07-12" → "ראשון, 12 ביולי" */
export function formatDayDateHe(iso) {
  const d = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${HE_WEEKDAYS[d.getDay()]}, ${d.getDate()} ב${HE_MONTHS[d.getMonth()]}`;
}

/** "09:20:00" → "09:20" */
export function formatTime(value) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

/** גודל קובץ בייטים → "240KB" / "1.2MB" */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// TODO: ספירה-לאחור עד מועד תור ("בעוד 3 ימים"); המרת אזורי זמן אם נדרש.
