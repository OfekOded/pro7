import { Icon } from "../icons";
import styles from "./EmptyState.module.css";

/**
 * EmptyState — מצב ריק/מסך-בהמשך. משמש בדפי ה-placeholder (פריטי ניווט
 * שאינם בין 8 המוקאפים) ובמצבי "אין נתונים".
 *
 * @param {string} [icon='grid']
 * @param {string} title
 * @param {string} [description]
 * @param {React.ReactNode} [action]
 */
export function EmptyState({ icon = "grid", title, description, action, className = "" }) {
  return (
    <div className={`${styles.empty} ${className}`}>
      <span className={styles.icon}>
        <Icon name={icon} size={26} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.desc}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}

export default EmptyState;
