import { PlaceholderPage } from "../../components/layout";

/**
 * ProfilePage (מטופל) — פרופיל וניהול פרטים אישיים.
 * TODO: טופס עריכת פרטי משתמש (שם, טלפון, דוא״ל), שינוי סיסמה,
 *       והעדפות התראות. מקור: GET/PUT /api/users/me (authService/userService).
 */
export function PatientProfilePage() {
  return (
    <PlaceholderPage
      title="פרופיל"
      icon="user"
      description="עריכת פרטים אישיים, שינוי סיסמה והעדפות. יחובר ל-GET/PUT /api/users/me."
    />
  );
}

export default PatientProfilePage;
