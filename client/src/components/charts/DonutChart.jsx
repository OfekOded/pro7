import styles from "./DonutChart.module.css";

/**
 * DonutChart — דונאט התפלגות (CSS טהור עם conic-gradient) + מקרא.
 * הערכים הם אחוזים (סוכמים ל-100). מרכז לבן מציג סה״כ.
 *
 * @param {{key:string,label:string,value:number,color:string}[]} segments
 * @param {string} [centerLabel='סה״כ'] - תווית במרכז.
 * @param {string|number} [centerValue] - ערך גדול במרכז.
 */
export function DonutChart({ segments, centerLabel = "סה״כ", centerValue, className = "" }) {
  let acc = 0;
  const stops = segments
    .map((s) => {
      const from = acc;
      acc += s.value;
      return `${s.color} ${from}% ${acc}%`;
    })
    .join(", ");

  return (
    <div className={`${styles.wrap} ${className}`}>
      <div className={styles.donut} style={{ background: `conic-gradient(${stops})` }}>
        <div className={styles.hole}>
          {centerValue != null ? <span className={styles.centerValue}>{centerValue}</span> : null}
          <span className={styles.centerLabel}>{centerLabel}</span>
        </div>
      </div>
      <ul className={styles.legend}>
        {segments.map((s) => (
          <li className={styles.legendItem} key={s.key}>
            <span className={styles.legendDot} style={{ background: s.color }} />
            <span className={styles.legendLabel}>{s.label}</span>
            <span className={styles.legendValue}>{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonutChart;
