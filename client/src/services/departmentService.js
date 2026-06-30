import { api } from "./apiClient";

/**
 * departmentService — מחלקות רפואיות.
 * ⚠️ STUB. מקור: docs/API.md (departments).
 */
export const departmentService = {
  // GET /api/departments → Department[]
  list: () => api.get("/departments"),

  // TODO (admin): create/update/delete מחלקה.
};

export default departmentService;
