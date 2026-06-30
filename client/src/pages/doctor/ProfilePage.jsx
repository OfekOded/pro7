import { PlaceholderPage } from "../../components/layout";

/**
 * ProfilePage (רופא/ה) — פרופיל מקצועי.
 * TODO: עריכת התמחות, חדר, ביוגרפיה ופרטי קשר. מקור: GET/PUT /api/doctors/me.
 */
export function DoctorProfilePage() {
  return (
    <PlaceholderPage
      title="פרופיל"
      icon="user"
      description="עריכת פרטים מקצועיים (התמחות, חדר, ביו). יחובר ל-GET/PUT /api/doctors/me."
    />
  );
}

export default DoctorProfilePage;
