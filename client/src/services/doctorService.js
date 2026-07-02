import { api } from "./apiClient";

/**
 * doctorService — רופאים, זמינות ואג׳נדה.
 * ⚠️ STUB. מקור: docs/API.md (doctors).
 */
export const doctorService = {
  // GET /api/doctors?departmentId= → Doctor[]
  listByDepartment: (departmentId) =>
    api.get(`/doctors?departmentId=${encodeURIComponent(departmentId)}`),

  // GET /api/doctors/:id → Doctor
  get: (id) => api.get(`/doctors/${id}`),

  // GET /api/doctors/:id/availability?date= → Slot[]  (חלונות פנויים ליום)
  availability: (id, date) =>
    api.get(`/doctors/${id}/availability?date=${encodeURIComponent(date)}`),

  // GET /api/doctors/me/agenda?date= → אג׳נדת היום (רופא/ה מחובר/ת)
  agenda: (date) => api.get(`/doctors/me/agenda?date=${encodeURIComponent(date)}`),

  // PUT /api/doctors/me — עדכון פרופיל מקצועי
  updateMe: (payload) => api.put("/doctors/me", payload),

  // PUT /api/doctors/me/availability — שמירת יומן הזמינות השבועי
  saveAvailability: (payload) => api.put("/doctors/me/availability", payload),
};

export default doctorService;
