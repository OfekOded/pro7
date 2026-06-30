import { Routes, Route, Navigate } from "react-router-dom";

import { AppShell } from "./components/layout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PATHS } from "./lib/paths";
import { ROLES } from "./lib/roles";
import { currentPatient, currentDoctor, currentAdmin } from "./data/mock";

// אימות
import LoginPage from "./pages/auth/LoginPage";

// מטופל
import DashboardPage from "./pages/patient/DashboardPage";
import BookingWizardPage from "./pages/patient/BookingWizardPage";
import AppointmentsPage from "./pages/patient/AppointmentsPage";
import MedicalRecordPage from "./pages/patient/MedicalRecordPage";
import PatientProfilePage from "./pages/patient/ProfilePage";

// רופא/ה
import AgendaPage from "./pages/doctor/AgendaPage";
import VisitPage from "./pages/doctor/VisitPage";
import DoctorPatientsPage from "./pages/doctor/PatientsPage";
import DoctorAvailabilityPage from "./pages/doctor/AvailabilityPage";
import DoctorProfilePage from "./pages/doctor/ProfilePage";

// מנהל/ת
import AdminDashboardPage from "./pages/admin/DashboardPage";
import AdminUsersPage from "./pages/admin/UsersPage";
import AdminDoctorsPage from "./pages/admin/DoctorsPage";
import AdminDepartmentsPage from "./pages/admin/DepartmentsPage";

/**
 * App — מפת הראוטים של הלקוח.
 *
 * שלוש קבוצות מוגנות לפי תפקיד, כל אחת עטופה ב-ProtectedRoute (STUB כרגע)
 * וב-AppShell המתאים (סייד-בר + מעטפת). ראו lib/paths.js + lib/roles.js.
 *
 * ⚠️ ה-user מגיע כרגע מ-data/mock. בשלב הלוגיקה — מ-AuthContext, וההפניה
 *    לאחר התחברות תהיה לפי תפקיד המשתמש.
 */
export default function App() {
  return (
    <Routes>
      {/* ציבורי */}
      <Route path={PATHS.login} element={<LoginPage />} />

      {/* ===== מטופל ===== */}
      <Route element={<ProtectedRoute allow={[ROLES.patient]} />}>
        <Route element={<AppShell role={ROLES.patient} user={currentPatient} />}>
          <Route path={PATHS.patientDashboard} element={<DashboardPage />} />
          <Route path={PATHS.book} element={<BookingWizardPage />} />
          <Route path={PATHS.appointments} element={<AppointmentsPage />} />
          <Route path={PATHS.record} element={<MedicalRecordPage />} />
          <Route path={PATHS.patientProfile} element={<PatientProfilePage />} />
        </Route>
      </Route>

      {/* ===== רופא/ה ===== */}
      <Route element={<ProtectedRoute allow={[ROLES.doctor]} />}>
        <Route element={<AppShell role={ROLES.doctor} user={currentDoctor} />}>
          <Route path={PATHS.doctorAgenda} element={<AgendaPage />} />
          <Route path={PATHS.doctorVisit} element={<VisitPage />} />
          <Route path={PATHS.doctorPatients} element={<DoctorPatientsPage />} />
          <Route path={PATHS.doctorAvailability} element={<DoctorAvailabilityPage />} />
          <Route path={PATHS.doctorProfile} element={<DoctorProfilePage />} />
        </Route>
      </Route>

      {/* ===== מנהל/ת ===== */}
      <Route element={<ProtectedRoute allow={[ROLES.admin]} />}>
        <Route element={<AppShell role={ROLES.admin} user={currentAdmin} />}>
          <Route path={PATHS.adminDashboard} element={<AdminDashboardPage />} />
          <Route path={PATHS.adminUsers} element={<AdminUsersPage />} />
          <Route path={PATHS.adminDoctors} element={<AdminDoctorsPage />} />
          <Route path={PATHS.adminDepartments} element={<AdminDepartmentsPage />} />
        </Route>
      </Route>

      {/* ברירת מחדל — לכל נתיב לא מוכר */}
      <Route path="*" element={<Navigate to={PATHS.login} replace />} />
    </Routes>
  );
}
