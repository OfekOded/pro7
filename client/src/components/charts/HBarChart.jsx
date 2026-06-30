import styles from "./HBarChart.module.css";

/**
 * HBarChart — פסים אופקיים (עומס לפי רופא/ה). CSS טהור.
 * שם בצד ההתחלה, פס מילוי בגרדיאנט, וערך בקצה.
 *
 * @param {{name:string,value:number}[]} data - value יחסי (0–100 או מוחלט).
 * @param {string} [suffix=''] - סיומת לערך (למשל "%").
 */
export function HBarChart({ data, suffix = "", className = "" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={`${styles.chart} ${className}`}>
      {data.map((d, i) => (
        <div className={styles.row} key={i}>
          <span className={styles.name}>{d.name}</span>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className={styles.value}>
            {d.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

export default HBarChart;
