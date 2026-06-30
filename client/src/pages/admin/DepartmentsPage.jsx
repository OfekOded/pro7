import { PlaceholderPage } from "../../components/layout";

/**
 * DepartmentsPage (מנהל/ת) — ניהול מחלקות.
 * TODO: CRUD מחלקות (שם, אייקון, תיאור). מקור: /api/departments (admin).
 */
export function AdminDepartmentsPage() {
  return (
    <PlaceholderPage
      title="ניהול מחלקות"
      icon="building"
      description="הוספה/עריכת מחלקות רפואיות. יחובר ל-/api/departments (admin)."
    />
  );
}

export default AdminDepartmentsPage;
