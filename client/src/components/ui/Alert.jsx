import { Icon } from "../icons";
import styles from "./Alert.module.css";

const ICON_BY_VARIANT = {
  success: "checkCircle",
  error: "alertTriangle",
  info: "info",
};

/**
 * Alert — שורת התראה עם אייקון וטקסט.
 * @param {'success'|'error'|'info'} [variant='info']
 */
export function Alert({ variant = "info", icon, children, className = "" }) {
  return (
    <div className={`${styles.alert} ${styles[variant]} ${className}`} role="status">
      <Icon name={icon || ICON_BY_VARIANT[variant]} size={18} className={styles.icon} />
      <div className={styles.body}>{children}</div>
    </div>
  );
}

export default Alert;
