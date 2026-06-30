import { NavLink } from "react-router-dom";
import { Icon } from "../icons";
import { Avatar } from "../ui/Avatar";
import { NAV_BY_ROLE, ROLE_THEME, ROLE_LABEL } from "../../lib/roles";
import styles from "./Sidebar.module.css";

/**
 * Sidebar — סייד-בר מודע-תפקיד (דסקטופ). ב-RTL הוא יושב בצד ימין.
 * הפריט הפעיל מודגש לפי ערכת הצבע של התפקיד (כחול / ירוק לרופא/ה).
 * מוסתר במובייל (ראו AppShell + MobileBottomNav).
 *
 * @param {'patient'|'doctor'|'admin'} role
 * @param {{fullName:string,initial:string,role:string}} user
 */
export function Sidebar({ role, user }) {
  const nav = NAV_BY_ROLE[role] ?? [];
  const theme = ROLE_THEME[role] ?? "brand";

  return (
    <aside className={`${styles.sidebar} ${styles[`theme-${theme}`]}`}>
      <div className={styles.brand}>
        <span className={styles.logo}>
          <Icon name="plus" size={20} stroke={2.4} />
        </span>
        <span className={styles.brandName}>מרפאה חכמה</span>
      </div>

      <nav className={styles.nav}>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {user ? (
        <div className={styles.userCard}>
          <Avatar initial={user.initial} size={36} tone={theme} />
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.fullName}</div>
            <div className={styles.userRole}>{ROLE_LABEL[user.role] ?? ROLE_LABEL[role]}</div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export default Sidebar;
