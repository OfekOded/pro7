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

  // PATCH /api/users/:id — עדכון משתמש (למשל השבתה/הפעלה)
  setUserStatus: (id, status) => api.patch(`/users/${id}`, { status }),

  // TODO: CRUD מלא לרופאים/מחלקות.
};

export default adminService;
