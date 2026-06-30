import { Icon } from "../icons";
import styles from "./StatCard.module.css";

/**
 * StatCard — כרטיס מדד. משמש באג׳נדת הרופא/ה ובדשבורד המנהל/ת.
 *
 * @param {string} label
 * @param {string|number} value
 * @param {string} [icon] - שם אייקון; מוצג בריבוע צבעוני לפי tone.
 * @param {'brand'|'green'|'amber'|'accent'} [tone='brand']
 * @param {string} [delta] - דלתא (למשל "▲ 12%").
 * @param {boolean} [deltaUp] - האם הדלתא חיובית (ירוק) או לא (אדום).
 */
export function StatCard({ label, value, icon, tone = "brand", delta, deltaUp, className = "" }) {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.top}>
        {icon ? (
          <span className={`${styles.icon} ${styles[tone]}`}>
            <Icon name={icon} size={18} />
          </span>
        ) : null}
        {delta ? (
          <span className={`${styles.delta} ${deltaUp ? styles.up : styles.down}`}>{delta}</span>
        ) : null}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default StatCard;
