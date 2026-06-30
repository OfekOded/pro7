import styles from "./Chip.module.css";

/**
 * Chip — צ׳יפ סינון עם מונה. משמש בפילטרים של "התורים שלי".
 * הצ׳יפ הפעיל מוצג כממולא כהה; לא-פעיל לבן עם נקודת צבע אופציונלית.
 *
 * @param {string} label
 * @param {number} [count] - מונה לצד התווית.
 * @param {boolean} [active]
 * @param {string} [dotColor] - צבע נקודה (CSS var) לצ׳יפ סטטוס לא-פעיל.
 * @param {string} [activeInk] - צבע טקסט פעיל (לסטטוס); ברירת מחדל לבן על רקע כהה.
 */
export function Chip({ label, count, active = false, dotColor, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.chip} ${active ? styles.active : styles.inactive} ${className}`}
    >
      {!active && dotColor ? (
        <span className={styles.dot} style={{ background: dotColor }} />
      ) : null}
      {label}
      {count != null ? <span className={styles.count}> · {count}</span> : null}
    </button>
  );
}

export default Chip;
