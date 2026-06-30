import styles from "./BarChart.module.css";

/**
 * BarChart — גרף עמודות אנכיות (CSS טהור, ללא ספרייה).
 * ערך מעל כל עמודה ותווית מתחת; מילוי בגרדיאנט כחול-תכלת.
 * בפרודקשן ניתן להחליף בספריית גרפים (Recharts/Chart.js).
 *
 * @param {{label:string,value:number}[]} data
 */
export function BarChart({ data, className = "" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={`${styles.chart} ${className}`}>
      {data.map((d, i) => (
        <div className={styles.col} key={i}>
          <span className={styles.value}>{d.value}</span>
          <div className={styles.barTrack}>
            <div className={styles.bar} style={{ height: `${(d.value / max) * 100}%` }} />
          </div>
          <span className={styles.label}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default BarChart;
