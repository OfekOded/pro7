import { PlaceholderPage } from "../../components/layout";

/**
 * AvailabilityPage (רופא/ה) — יומן זמינות.
 * TODO: עריכת חלונות זמינות שבועיים/יומיים (doctor_availability).
 *       מקור: GET/PUT /api/doctors/me/availability (doctorService).
 */
export function DoctorAvailabilityPage() {
  return (
    <PlaceholderPage
      title="יומן זמינות"
      icon="calendarDays"
      description="ניהול חלונות הזמינות לזימון תורים. יחובר לטבלת doctor_availability."
    />
  );
}

export default DoctorAvailabilityPage;
