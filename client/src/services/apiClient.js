/**
 * apiClient — שכבת תקשורת גנרית מול ה-REST API (דרישת "Fetch גנרי" באפיון).
 *
 * מספק עטיפה אחידה ל-fetch: base URL מ-env, צירוף טוקן JWT, סריאליזציה של JSON,
 * וטיפול שגיאות. כל ה-services משתמשים אך ורק בו (לא קוראים ל-fetch ישירות).
 *
 * רובו ממומש; מה שנותר מסומן ב-TODO (מקור הטוקן, רענון טוקן, ביטול בקשות).
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

/**
 * שליפת הטוקן לבקשות מאומתות.
 * TODO: להעביר את מקור הטוקן ל-AuthContext (כרגע localStorage כפתרון ביניים),
 *       ולהוסיף רענון טוקן כשפג תוקף (401 → refresh → retry).
 */
function getToken() {
  return localStorage.getItem("token");
}

/** שגיאת API עם סטטוס וגוף — לטיפול אחיד בצד הקורא. */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = "GET", body, headers = {}, signal } = {}) {
  const token = getToken();
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

  // 204 No Content
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
