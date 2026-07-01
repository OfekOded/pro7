import { NavLink } from "react-router-dom";
import { Icon } from "../icons";
import { MOBILE_NAV_BY_ROLE, ROLE_THEME } from "../../lib/roles";
import styles from "./MobileBottomNav.module.css";

/**
 * MobileBottomNav — בר ניווט תחתון למובייל, מודע-תפקיד.
 * מוצג רק ב-≤768px; מוסתר בדסקטופ. צבע הפריט הפעיל לפי ערכת התפקיד.
 *
 * @param {'patient'|'doctor'|'admin'} role
 */
export function MobileBottomNav({ role = "patient" }) {
  const items = MOBILE_NAV_BY_ROLE[role] ?? MOBILE_NAV_BY_ROLE.patient;
  const theme = ROLE_THEME[role] ?? "brand";

  return (
    <nav className={`${styles.bar} ${styles[`theme-${theme}`]}`}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
        >
          <Icon name={item.icon} size={22} />
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileBottomNav;
