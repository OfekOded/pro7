import { PlaceholderPage } from "../../components/layout";

/**
 * UsersPage (מנהל/ת) — ניהול משתמשים.
 * TODO: טבלת משתמשים (CRUD), סינון לפי תפקיד, ניהול הרשאות וחסימה.
 *       מקור: GET/POST/PUT/DELETE /api/users (adminService) — דורש role=admin.
 */
export function AdminUsersPage() {
  return (
    <PlaceholderPage
      title="ניהול משתמשים"
      icon="users"
      description="טבלת משתמשים עם סינון לפי תפקיד וניהול הרשאות. יחובר ל-/api/users (admin)."
    />
  );
}

export default AdminUsersPage;
