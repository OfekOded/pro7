import { useState } from "react";
import { Topbar } from "../../components/layout";
import { BarChart, DonutChart, HBarChart } from "../../components/charts";
import { adminStats } from "../../data/mock";
import styles from "./DashboardPage.module.css";

/**
 * DashboardPage (מסך 8) — דשבורד מנהל/ת: ניתוחים וסטטיסטיקות.
 * הגרפים בנויי-CSS (components/charts). נתונים מ-data/mock.
 * TODO: adminService.getStats(range) — כרטיסי נתונים והנתונים לגרפים
 *       לפי טווח (חודש/רבעון/שנה).
 */
export function AdminDashboardPage() {
  const [range, setRange] = useState(adminStats.ranges[0]);

  const byDeptSorted = [...adminStats.byDepartment].sort((a, b) => b.value - a.value);

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
          {adminStats.cards.map((c) => (
            <div key={c.id} className={styles.statCard}>
              <div className={styles.statLabel}>{c.label}</div>
              <div
                className={styles.statValue}
                style={{ color: c.id === "cancel" ? "var(--accent-ink)" : "var(--ink)" }}
              >
                {c.value}
              </div>
              <div className={`${styles.statDelta} ${c.deltaUp ? styles.up : styles.down}`}>
                {c.delta}
              </div>
            </div>
          ))}
        </div>

        {/* שורת גרפים */}
        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>תורים לפי מחלקה</h3>
            <BarChart data={byDeptSorted} />
          </div>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>התפלגות סטטוס</h3>
            <DonutChart
              segments={adminStats.statusBreakdown}
              centerValue={adminStats.cards[0].value}
              centerLabel="תורים"
            />
          </div>
        </div>

        {/* עומס לפי רופא/ה */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>עומס לפי רופא/ה (תורים החודש)</h3>
          <HBarChart data={adminStats.loadByDoctor} />
        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;
