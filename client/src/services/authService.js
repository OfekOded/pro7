import { api } from "./apiClient";

/**
 * authService — אימות והרשמה.
 * מקור ה-endpoints: docs/API.md (auth).
 *
 * ⚠️ STUB: החתימות מוגדרות; יש לוודא טיפול בטוקן (שמירה ב-AuthContext)
 *          ובשגיאות. ראו server/src/routes/auth.routes.js.
 */
export const authService = {
  // POST /api/auth/login → { token, user }
  login: (credentials) => api.post("/auth/login", credentials),

  // POST /api/auth/register (מטופלים בלבד) → { token, user }
  register: (payload) => api.post("/auth/register", payload),

  // GET /api/auth/me → { user } (לפי הטוקן)
  me: () => api.get("/auth/me"),

  // TODO: logout (ניקוי טוקן בצד לקוח), refresh token, forgot/reset password.
};

export default authService;
