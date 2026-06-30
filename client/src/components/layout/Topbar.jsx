import { Icon } from "../icons";
import styles from "./Topbar.module.css";

/**
 * Topbar — בר עליון לכל מסך פנימי (כותרת + פעולות).
 * פסיבי בלבד: החיפוש/הפעמון תצוגתיים בשלב זה.
 *
 * @param {string} title
 * @param {string} [subtitle]
 * @param {boolean} [search] - הצגת תיבת חיפוש.
 * @param {boolean} [bell] - הצגת כפתור התראות (עם נקודה).
 * @param {React.ReactNode} [actions] - כפתורי פעולה בצד הסיום.
 */
export function Topbar({ title, subtitle, search = false, bell = false, actions }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.titleWrap}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
      </div>

      <div className={styles.controls}>
        {search ? (
          <div className={styles.search}>
            <Icon name="search" size={16} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="חיפוש…" />
          </div>
        ) : null}
        {actions}
        {bell ? (
          <button type="button" className={styles.bell} aria-label="התראות">
            <Icon name="bell" size={19} />
            <span className={styles.bellDot} />
          </button>
        ) : null}
      </div>
    </header>
  );
}

export default Topbar;
