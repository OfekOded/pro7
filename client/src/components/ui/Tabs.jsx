import styles from "./Tabs.module.css";

/**
 * Tabs — מתג טאבים נשלט.
 * @param {{key:string,label:string}[]} tabs
 * @param {string} value - מפתח הטאב הפעיל.
 * @param {(key:string)=>void} onChange
 * @param {'pill'|'underline'} [variant='underline']
 */
export function Tabs({ tabs, value, onChange, variant = "underline", className = "" }) {
  return (
    <div className={`${styles.tabs} ${styles[variant]} ${className}`} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          className={`${styles.tab} ${value === t.key ? styles.active : ""}`}
          onClick={() => onChange?.(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
