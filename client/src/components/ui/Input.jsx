import styles from "./Input.module.css";

/**
 * Field — עוטף תווית + שדה + הודעת שגיאה. עוטף Input/Textarea או כל ילד.
 */
export function Field({ label, htmlFor, error, hint, children, className = "" }) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label ? (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <span className={styles.error}>{error}</span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </div>
  );
}

/**
 * Input — שדה קלט. `ltr` למספרים/אימייל/ת.ז (direction:ltr, יישור לימין).
 */
export function Input({ error = false, ltr = false, className = "", ...rest }) {
  const cls = [styles.control, error ? styles.invalid : "", ltr ? "ltr" : "", className]
    .filter(Boolean)
    .join(" ");
  return <input className={cls} {...rest} />;
}

/**
 * Textarea — אזור טקסט רב-שורתי (סיבת ביקור, סיכום וכו').
 */
export function Textarea({ error = false, rows = 4, className = "", ...rest }) {
  const cls = [styles.control, styles.textarea, error ? styles.invalid : "", className]
    .filter(Boolean)
    .join(" ");
  return <textarea rows={rows} className={cls} {...rest} />;
}

export default Input;
