import { Icon } from "../icons";
import styles from "./FileUpload.module.css";

/**
 * Dropzone — אזור גרירה/בחירה להעלאת קובץ (תצוגה בלבד בשלב זה).
 * ⚠️ ההעלאה עצמה (multipart → POST /api/documents) תמומש מול ה-Backend
 *    דרך services/recordService — ראו ה-TODO שם וב-server/src/middleware/upload.js.
 */
export function Dropzone({
  hint = "גרור/י קובץ לכאן או בחר/י מהמחשב",
  accept = "PDF, JPG, PNG · עד 10MB",
  className = "",
  ...rest
}) {
  return (
    <div className={`${styles.dropzone} ${className}`} {...rest}>
      <span className={styles.dropIcon}>
        <Icon name="upload" size={22} />
      </span>
      <div className={styles.dropText}>{hint}</div>
      <div className={styles.dropHint}>{accept}</div>
    </div>
  );
}

/**
 * FileRow — שורת קובץ שהועלה: ריבוע אייקון צבעוני + שם + מטא.
 * @param {'pdf'|'image'} [kind='pdf']
 */
export function FileRow({ name, kind = "pdf", meta, action, className = "" }) {
  return (
    <div className={`${styles.row} ${className}`}>
      <span className={`${styles.fileIcon} ${kind === "image" ? styles.image : styles.pdf}`}>
        <Icon name="file" size={18} />
      </span>
      <div className={styles.rowBody}>
        <div className={styles.rowName}>{name}</div>
        {meta ? <div className={styles.rowMeta}>{meta}</div> : null}
      </div>
      {action}
    </div>
  );
}

export default Dropzone;
