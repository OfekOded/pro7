import { PlaceholderPage } from "../../components/layout";

/**
 * PatientsPage (רופא/ה) — רשימת המטופלים של הרופא/ה.
 * TODO: טבלה/רשימת מטופלים עם חיפוש וקישור לתיק הרפואי.
 *       מקור: GET /api/doctors/me/patients (doctorService).
 */
export function DoctorPatientsPage() {
  return (
    <PlaceholderPage
      title="המטופלים שלי"
      icon="users"
      description="רשימת המטופלים עם חיפוש וקישור לתיק הרפואי. יחובר ל-GET /api/doctors/me/patients."
    />
  );
}

export default DoctorPatientsPage;
