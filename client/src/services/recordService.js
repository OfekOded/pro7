import { api } from "./apiClient";

/**
 * recordService — תיק רפואי: ביקורים, מרשמים, מסמכים.
 * ⚠️ STUB. מקור: docs/API.md (record / visits / prescriptions / documents).
 */
export const recordService = {
  // GET /api/patients/:id/record → { patient, visits, prescriptions, documents }
  get: (patientId) => api.get(`/patients/${patientId}/record`),

  // POST /api/visits — סגירת ביקור (רופא/ה): { appointmentId, diagnosis, summary }
  closeVisit: (payload) => api.post("/visits", payload),

  // POST /api/prescriptions — { visitId, medication, dosage }
  addPrescription: (payload) => api.post("/prescriptions", payload),

  // POST /api/documents — העלאת מסמך (multipart). formData: { file, patientId, visitId? }
  uploadDocument: (formData) => api.upload("/documents", formData),

  // TODO: מחיקת מסמך/מרשם; הורדת קובץ (GET /documents/:id).
};

export default recordService;
