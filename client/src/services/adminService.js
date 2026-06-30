import { api } from "./apiClient";

/**
 * adminService — ניהול וניתוחים (role=admin בלבד).
 * ⚠️ STUB. מקור: docs/API.md (admin).
 */
export const adminService = {
  // GET /api/admin/stats?range=month|quarter|year → נתוני הדשבורד והגרפים
  stats: (range = "month") => api.get(`/admin/stats?range=${range}`),

  // GET /api/users → User[]  ·  ניהול משתמשים
  users: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/users${qs ? `?${qs}` : ""}`);
  },

  // TODO: CRUD משתמשים/רופאים/מחלקות, ניהול הרשאות.
};

export default adminService;
