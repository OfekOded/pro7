import { NavLink } from "react-router-dom";
import { Icon } from "../icons";
import { MOBILE_NAV_PATIENT } from "../../lib/roles";
import styles from "./MobileBottomNav.module.css";

/**
 * MobileBottomNav — בר ניווט תחתון למובייל (מטופל בלבד).
 * מוצג רק ב-≤768px; מוסתר בדסקטופ.
 */
export function MobileBottomNav() {
  return (
    <nav className={styles.bar}>
      {MOBILE_NAV_PATIENT.map((item) => (
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
