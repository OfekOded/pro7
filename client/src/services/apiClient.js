/**
 * apiClient — שכבת תקשורת גנרית מול ה-REST API (דרישת "Fetch גנרי" באפיון).
 *
 * מצבי עבודה (VITE_API_MODE):
 *  - "mock" (ברירת מחדל): הבקשות מנותבות ל-mockServer בתוך הדפדפן,
 *    שמממש את חוזה docs/API.md מעל נתוני הדמו. כל שכבת הלקוח רצה בקוד אמיתי.
 *  - "server": fetch אמיתי אל VITE_API_URL — בלי לשנות אף דף.
 *
 * אבטחה:
 *  - הטוקן נקרא מ-tokenStore (memory-first) — לא ישירות מ-localStorage.
 *  - תשובת 401 עם טוקן קיים משדרת אירוע "auth:unauthorized" → ניתוק גלובלי
 *    (AuthContext מאזין). כישלון login עצמו לא מפעיל את המנגנון.
 *  - שגיאות עטופות ב-ApiError אחיד (message/status/data) לשני המצבים.
 */

import { getToken } from "./tokenStore";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
const API_MODE = import.meta.env.VITE_API_MODE ?? "mock";

/** שגיאת API עם סטטוס וגוף — לטיפול אחיד בצד הקורא. */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/** 401 על בקשה מאומתת → ניתוק גלובלי (מדלגים על ניסיון התחברות שנכשל). */
function notifyUnauthorized(path, hadToken) {
  if (hadToken && !path.startsWith("/auth/login") && !path.startsWith("/auth/register")) {
    window.dispatchEvent(new Event("auth:unauthorized"));
  }
}

async function request(path, { method = "GET", body, headers = {}, signal } = {}) {
  const token = getToken();

  /* ---------- מצב mock: ניתוב ל"שרת" הדמו שבדפדפן ---------- */
  if (API_MODE === "mock") {
    const { handleMockRequest } = await import("./mockServer");
    const res = await handleMockRequest({ method, path, body, token });
    if (res.status === 401) notifyUnauthorized(path, !!token);
    if (res.status >= 400) {
      throw new ApiError(res.data?.message || `שגיאת שרת (${res.status})`, res.status, res.data);
    }
    return res.data;
  }

  /* ---------- מצב server: fetch אמיתי ---------- */
  const isForm = body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body == null ? undefined : isForm ? body : JSON.stringify(body),
    signal,
  });

  if (res.status === 401) notifyUnauthorized(path, !!token);
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.message || `שגיאת שרת (${res.status})`, res.status, data);
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
  /** העלאת קובץ (multipart) — מעבירים FormData; הדפדפן קובע Content-Type. */
  upload: (path, formData, opts) => request(path, { ...opts, method: "POST", body: formData }),
};

export default api;
