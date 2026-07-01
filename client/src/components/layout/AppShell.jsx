import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import styles from "./AppShell.module.css";

/**
 * AppShell — מעטפת היישום לאזורים המאומתים: סייד-בר (דסקטופ) + אזור תוכן
 * עם <Outlet/>, ובמובייל בר-ניווט תחתון למטופל.
 *
 * נצרך ב-App.jsx כ-layout route עוטף, עם role/user מתאימים.
 * ⚠️ user מגיע כרגע מ-mock; כשיהיה AuthContext יש למשוך אותו משם.
 *
 * @param {'patient'|'doctor'|'admin'} role
 * @param {object} user
 */
export function AppShell({ role, user }) {
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
