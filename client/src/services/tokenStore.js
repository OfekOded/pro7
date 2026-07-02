/**
 * tokenStore — ניהול מאובטח של טוקן ההתחברות בצד הלקוח.
 *
 * עקרונות אבטחה:
 *  - נשמר **רק הטוקן** — לעולם לא סיסמה ולא אובייקט משתמש/PII.
 *    פרטי המשתמש נטענים מחדש בכל עליית אפליקציה דרך GET /auth/me.
 *  - memory-first: הקריאה השוטפת היא ממשתנה בזיכרון; ה-storage משמש רק
 *    לשחזור סשן אחרי רענון.
 *  - sessionStorage כברירת מחדל (נמחק בסגירת הטאב); localStorage רק אם
 *    המשתמש ביקש במפורש "זכור אותי".
 *  - logout מנקה את כל המקומות (זיכרון + שני ה-storages).
 *
 * הערת פרודקשן: ההגנה החזקה ביותר מפני XSS היא httpOnly Secure cookie
 * שמנוהל ע״י השרת. הפרויקט משתמש ב-Bearer header לפי docs/API.md; אם
 * יוחלט לעבור ל-cookies — הקובץ הזה הוא הנקודה היחידה שמשתנה.
 */

const KEY = "clinic.auth.token";

let memoryToken = null;

/** הטוקן הנוכחי (זיכרון → sessionStorage → localStorage). */
export function getToken() {
  if (memoryToken) return memoryToken;
  try {
    memoryToken = sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY);
  } catch {
    memoryToken = null; // storage חסום (מצב פרטי/הרשאות) — ממשיכים ללא שחזור
  }
  return memoryToken;
}

/** שמירת טוקן. remember=true → localStorage (סשן מתמשך), אחרת sessionStorage. */
export function setToken(token, remember = false) {
  clearToken();
  memoryToken = token;
  try {
    (remember ? localStorage : sessionStorage).setItem(KEY, token);
  } catch {
    /* storage חסום — הטוקן יחיה בזיכרון בלבד לסשן הנוכחי */
  }
}

/** ניקוי מלא — נקרא ב-logout וב-401. */
export function clearToken() {
  memoryToken = null;
  try {
    sessionStorage.removeItem(KEY);
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
