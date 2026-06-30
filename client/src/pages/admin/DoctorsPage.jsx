import { PlaceholderPage } from "../../components/layout";

/**
 * DoctorsPage (מנהל/ת) — ניהול רופאים.
 * TODO: CRUD רופאים, שיוך למחלקה, התמחות וחדר. מקור: /api/doctors (admin).
 */
export function AdminDoctorsPage() {
  return (
    <PlaceholderPage
      title="ניהול רופאים"
      icon="stethoscope"
      description="הוספה/עריכת רופאים ושיוכם למחלקות. יחובר ל-/api/doctors (admin)."
    />
  );
}

export default AdminDoctorsPage;
