import styles from "./PageLoader.module.css";

/**
 * PageLoader — חיווי טעינה מרכזי (ספינר + תווית). משמש בזמן שליפות
 * מה-API ובזמן שחזור הסשן ב-ProtectedRoute.
 */
export function PageLoader({ label = "טוען…", className = "" }) {
  return (
    <div className={`${styles.wrap} ${className}`} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default PageLoader;
