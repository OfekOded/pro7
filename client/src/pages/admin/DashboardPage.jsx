import { useEffect, useRef, useState } from "react";
import { Topbar } from "../../components/layout";
import { BarChart, DonutChart, HBarChart } from "../../components/charts";
import { adminStats } from "../../data/mock";
import styles from "./DashboardPage.module.css";

/** מקדם היקף לכל טווח — להמחשת החלפת נתונים חיה. */
const FACTORS = { חודש: 1, רבעון: 3, שנה: 12 };

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
  const cur = useCountUp(card.target);
  return (
    <div className={styles.statCard}>
      <div className={styles.statLabel}>{card.label}</div>
      <div
        className={styles.statValue}
        style={{ color: card.id === "cancel" ? "var(--accent-ink)" : "var(--ink)" }}
      >
        {card.fmt(cur)}
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
 * ✦ שדרוגי חוויה: מספרים שמטפסים (count-up), גרפים שצומחים מאפס, ובורר טווח
 *   (חודש/רבעון/שנה) שמחליף את הנתונים חי עם אנימציה חוזרת. מכבד reduced-motion.
 *
 * TODO: adminService.getStats(range) — להחליף את הסקיילינג המקומי בנתונים אמיתיים
 *       (אותו מבנה שמוצג כאן). ראו docs/API.md (admin/stats).
 */
export function AdminDashboardPage() {
  const [range, setRange] = useState(adminStats.ranges[0]);
  const f = FACTORS[range] ?? 1;

  // ----- נתוני הכרטיסים מותאמים לטווח -----
  const cards = adminStats.cards.map((c) => {
    const numeric = parseFloat(String(c.value).replace(/[^0-9.]/g, ""));
    let target = numeric;
    let fmt = intComma;
    if (c.id === "total") target = numeric * f;
    else if (c.id === "patients") target = numeric * (1 + (f - 1) * 0.25);
    else if (c.id === "cancel") fmt = percent;
    return { ...c, target, fmt };
  });
  const totalNumeric = parseFloat(adminStats.cards[0].value.replace(/[^0-9.]/g, "")) * f;

  // ----- נתוני הגרפים: מתחילים מאפס וצומחים (transition ב-CSS) -----
  const [barData, setBarData] = useState(() =>
    adminStats.byDepartment.map((d) => ({ ...d, value: 0 }))
  );
  const [loadData, setLoadData] = useState(() =>
    adminStats.loadByDoctor.map((d) => ({ ...d, value: 0 }))
  );

  useEffect(() => {
    const factor = FACTORS[range] ?? 1;
    // setTimeout (ולא rAF) — אמין גם בטאב לא-פעיל; ה-CSS transition מנפיש את הצמיחה.
    const id = setTimeout(() => {
      setBarData(
        adminStats.byDepartment
          .map((d) => ({ ...d, value: Math.round(d.value * factor) }))
          .sort((a, b) => b.value - a.value)
      );
      setLoadData(adminStats.loadByDoctor.map((d) => ({ ...d, value: Math.round(d.value * factor) })));
    }, 60);
    return () => clearTimeout(id);
  }, [range]);

  return (
    <>
      <Topbar
        title="סקירה כללית"
        subtitle="יולי 2026"
        actions={
          <div className={styles.rangeGroup}>
            {adminStats.ranges.map((r) => (
              <button
                key={r}
                className={`${styles.rangeBtn} ${range === r ? styles.rangeActive : ""}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      <div className={styles.body}>
        {/* כרטיסי נתונים */}
        <div className={styles.statsGrid}>
          {cards.map((c) => (
            <AdminStatCard key={`${range}-${c.id}`} card={c} />
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
            <div key={range} className={styles.reveal}>
              <DonutChart
                segments={adminStats.statusBreakdown}
                centerValue={intComma(totalNumeric)}
                centerLabel="תורים"
              />
            </div>
          </div>
        </div>

        {/* עומס לפי רופא/ה */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>עומס לפי רופא/ה ({range})</h3>
          <HBarChart data={loadData} />
        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;
