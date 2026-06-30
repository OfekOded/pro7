import { api } from "./apiClient";

/**
 * appointmentService — תורים (זימון, רשימה, ביטול, קביעה מחדש).
 * ⚠️ STUB. מקור: docs/API.md (appointments).
 */
export const appointmentService = {
  // GET /api/appointments?status= → Appointment[] (מסונן לפי המשתמש/תפקיד)
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/appointments${qs ? `?${qs}` : ""}`);
  },

  // GET /api/appointments/:id → Appointment
  get: (id) => api.get(`/appointments/${id}`),

  // POST /api/appointments → Appointment
  // body: { doctorId, departmentId, date, time, reason }
  // ⚠️ השרת מאמת זמינות (double-booking) לפני שמירה.
  create: (payload) => api.post("/appointments", payload),

  // PATCH /api/appointments/:id { status:'cancelled' } — ביטול (עד 24ש לפני)
  cancel: (id) => api.patch(`/appointments/${id}`, { status: "cancelled" }),

  // TODO: reschedule (קביעה מחדש) — או PATCH מועד, או ביטול + create חדש.
  upcoming: () => api.get("/appointments?status=scheduled"),
};

export default appointmentService;
