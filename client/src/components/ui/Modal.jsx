import { Icon } from "../icons";
import styles from "./Modal.module.css";

/**
 * Modal — דיאלוג מודאלי פשוט עם שכבת רקע. ללא לוגיקה עסקית.
 * @param {boolean} open
 * @param {()=>void} onClose
 * @param {string} [title]
 * @param {React.ReactNode} [footer] - אזור הפעולות התחתון.
 */
export function Modal({ open, onClose, title, footer, children }) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.head}>
          <h3 className={styles.title}>{title}</h3>
          <button type="button" className={styles.close} onClick={onClose} aria-label="סגירה">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}

export default Modal;
