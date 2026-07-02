import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { useAuth } from "../../hooks/useAuth";
import styles from "./AppShell.module.css";

/**
 * AppShell — מעטפת היישום לאזורים המאומתים: סייד-בר (דסקטופ) + אזור תוכן
 * עם <Outlet/>, ובמובייל בר-ניווט תחתון מודע-תפקיד.
 *
 * המשתמש מגיע מ-AuthContext (useAuth) — לא מ-mock. הנתיב תמיד עטוף
 * ב-ProtectedRoute, כך שכאן user מובטח.
 *
 * @param {'patient'|'doctor'|'admin'} role - תפקיד קבוצת הנתיבים (קובע ניווט/ערכה).
 */
export function AppShell({ role }) {
  const { user } = useAuth();

  return (
    <div className={styles.shell}>
      <Sidebar role={role} user={user} />
      <main className={styles.content}>
        <Outlet />
      </main>
      {/* בר ניווט תחתון במובייל — לכל התפקידים (הסייד-בר מוסתר במובייל) */}
      <MobileBottomNav role={role} />
    </div>
  );
}

export default AppShell;
