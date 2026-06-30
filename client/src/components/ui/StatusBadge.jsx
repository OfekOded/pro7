import { statusMeta } from "../../lib/statuses";
import styles from "./StatusBadge.module.css";

/**
 * StatusBadge — באדג׳ גלולה לסטטוס תור (מתוכנן/הושלם/בוטל/לא הגיע).
 * הצבעים נגזרים מ-lib/statuses.js כך שהם עקביים בכל המערכת.
 *
 * @param {'scheduled'|'completed'|'cancelled'|'no_show'} status
 * @param {boolean} [dot=true] - הצגת נקודת הצבע.
 */
export function StatusBadge({ status, dot = true, className = "" }) {
  const meta = statusMeta(status);
  return (
    <span
      className={`${styles.badge} ${className}`}
      style={{ color: meta.ink, background: meta.soft }}
    >
      {dot ? <span className={styles.dot} style={{ background: meta.dot }} /> : null}
      {meta.label}
    </span>
  );
}

export default StatusBadge;
