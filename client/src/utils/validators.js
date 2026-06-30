/**
 * validators.js — עזרי ולידציה לטפסים (התחברות/הרשמה/ביקור).
 *
 * ⚠️ STUB חלקי: כללי בסיס מוגדרים; יש לחבר אותם לטפסים (LoginPage, וכו')
 *    ולהציג הודעות שגיאה דרך רכיב Field. ראו useForm.
 */

/** דוא״ל תקין (בדיקה בסיסית). */
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

/** תעודת זהות ישראלית — 9 ספרות + ספרת ביקורת (אלגוריתם לוהן ישראלי). */
export function isValidIsraeliId(id) {
  const s = String(id).trim();
  if (!/^\d{5,9}$/.test(s)) return false;
  const padded = s.padStart(9, "0");
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(padded[i]) * ((i % 2) + 1);
    if (digit > 9) digit -= 9;
    sum += digit;
  }
  return sum % 10 === 0;
}

/** טלפון ישראלי (נייד/קווי, עם או בלי מקף). */
export const isPhone = (v) => /^0\d{1,2}-?\d{7}$/.test(String(v).trim());

/** סיסמה: לפחות 8 תווים, אות וספרה. TODO: לחזק לפי מדיניות. */
export const isStrongPassword = (v) =>
  String(v).length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v);

/** שדה חובה לא ריק. */
export const isRequired = (v) => v != null && String(v).trim().length > 0;

// TODO: בונה ולידציה לטופס שלם (object schema) שמחזיר מפת errors ל-useForm.
