import { useEffect, useRef, useState } from "react";
import { Topbar } from "../../components/layout";
import { BarChart, DonutChart, HBarChart } from "../../components/charts";
import { PageLoader } from "../../components/ui";
import { useFetch } from "../../hooks/useFetch";
import { adminService } from "../../services/adminService";
import styles from "./DashboardPage.module.css";

/** תוויות הבורר → ערכי ה-API (docs/API.md: range=month|quarter|year). */
const RANGES = [
  { label: "חודש", key: "month" },
  { label: "רבעון", key: "quarter" },
  { label: "שנה", key: "year" },
];

const intComma = (n) => Math.round(n).toLocaleString("he-IL");
const percent = (n) => `${n.toFixed(1)}%`;
const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** מספר שמטפס מ-0 ליעד (ease-out cubic) באמצעות requestAnimationFrame.
 *  fallback ב-setTimeout מבטיח שהערך הסופי יוצג גם אם rAF מווסת (טאב לא פעיל). */
function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(prefersReduced() ? target : 0);
  const ref = useRef();
  useEffect(() => {
    if (prefersReduced()) {
      setVal(target);
      return;
    }
    let start;
    const tick = (ts) => {
      if (start == null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    const safety = setTimeout(() => setVal(target), duration + 250);
    return () => {
      cancelAnimationFrame(ref.current);
      clearTimeout(safety);
    };
  }, [target, duration]);
  return val;
}

/** כרטיס נתון בודד — מספר מטפס. ה-key (טווח) מרענן את האנימציה. */
function AdminStatCard({ card }) {
  const cur = useCountUp(card.value);
  const fmt = card.unit === "%" ? percent : intComma;
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{card.label}</div>
      <div
        className={styles.statValue}
        style={{ color: card.id === "cancel" ? "var(--accent-ink)" : "var(--ink)" }}
      >
        {fmt(cur)}
      </div>
      <div className={`${styles.statDelta} ${card.deltaUp ? styles.up : styles.down}`}>
        {card.delta}
      </div>
    </div>
  );
}

/**
 * AdminDashboardPage (מסך 8) — דשבורד מנהל/ת: ניתוחים וסטטיסטיקות.
 *
 * הנתונים נשלפים דרך adminService (GET /admin/stats?range=) — בורר הטווח
 * מפעיל שליפה מחדש, המספרים מטפסים והגרפים צומחים מהתשובה.
 */
export function AdminDashboardPage() {
  const [range, setRange] = useState(RANGES[0]);
  const { data, isLoading } = useFetch(() => adminService.stats(range.key), [range.key]);

  // הגרפים מתחילים מאפס וצומחים (CSS transition) בכל תשובה חדשה
  const [barData, setBarData] = useState([]);
  const [loadData, setLoadData] = useState([]);

  useEffect(() => {
    if (!data) return;
    setBarData(data.byDepartment.map((d) => ({ ...d, value: 0 })));
    setLoadData(data.loadByDoctor.map((d) => ({ ...d, value: 0 })));
    const id = setTimeout(() => {
      setBarData(data.byDepartment);
      setLoadData(data.loadByDoctor);
    }, 60);
    return () => clearTimeout(id);
  }, [data]);

  return (
    <>
      <Topbar
        title="סקירה כללית"
        subtitle="יולי 2026"
        actions={
          <div className={styles.rangeGroup}>
            {RANGES.map((r) => (
              <button
                key={r.key}
                className={`${styles.rangeBtn} ${range.key === r.key ? styles.rangeActive : ""}`}
                onClick={() => setRange(r)}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className={styles.body}>
        {isLoading && !data ? (
          <PageLoader label="טוען נתונים…" />
        ) : data ? (
          <>
            {/* כרטיסי נתונים */}
            <div className={styles.statsGrid}>
              {data.cards.map((c) => (
                <AdminStatCard key={`${range.key}-${c.id}`} card={c} />
              ))}
            </div>

            {/* שורת גרפים */}
            <div className={styles.chartsRow}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>תורים לפי מחלקה</h3>
                <BarChart data={barData} />
              </div>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>התפלגות סטטוס</h3>
                <div key={range.key} className={styles.reveal}>
                  <DonutChart
                    segments={data.statusBreakdown}
                    centerValue={intComma(data.total)}
                    centerLabel="תורים"
                  />
                </div>
              </div>
            </div>

            {/* עומס לפי רופא/ה */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>עומס לפי רופא/ה ({range.label})</h3>
              <HBarChart data={loadData} />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default AdminDashboardPage;
