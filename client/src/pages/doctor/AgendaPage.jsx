import { Link } from "react-router-dom";
import { Topbar } from "../../components/layout";
import { StatusBadge, Avatar } from "../../components/ui";
import { visitPath } from "../../lib/paths";
import { doctorAgenda } from "../../data/mock";
import styles from "./AgendaPage.module.css";

const VALUE_COLOR = {
  brand: "var(--brand-ink)",
  green: "var(--green-ink)",
  amber: "var(--amber-ink)",
  accent: "var(--accent-ink)",
};

/**
 * AgendaPage (מסך 6) — דשבורד רופא/ה: אג׳נדת היום.
 * נתונים מ-data/mock. TODO: doctorService.getAgenda(date) — סטטיסטיקות,
 * המטופל הבא, וציר התורים של היום.
 */
export function AgendaPage() {
  const { greeting, dateLabel, stats, nextPatient, timeline } = doctorAgenda;

  return (
    <>
      <Topbar title={`${greeting} ☀️`} subtitle={`${dateLabel} · 8 תורים היום`} bell />

      <div className={styles.body}>
        {/* סטטיסטיקות */}
        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.id} className={styles.statCard}>
              <div className={styles.statLabel}>{s.label}</div>
              <div
                className={styles.statValue}
                style={{ color: s.id === "today" ? "var(--ink)" : VALUE_COLOR[s.tone] }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* המטופל הבא */}
        <div className={styles.nextPatient}>
          <div className={styles.npInfo}>
            <Avatar initial={nextPatient.name[0]} size={52} tone="green" />
            <div>
              <div className={styles.npBadge}>המטופל הבא · {nextPatient.time}</div>
              <div className={styles.npName}>{nextPatient.name}</div>
              <div className={styles.npReason}>{nextPatient.reason}</div>
            </div>
          </div>
          <Link to={visitPath(1)} className={styles.npBtn}>
            פתח ביקור
          </Link>
        </div>

        {/* ציר זמן */}
        <section>
          <h2 className={styles.sectionTitle}>אג׳נדת היום</h2>
          <div className={styles.timeline}>
            {timeline.map((row, i) => (
              <div
                key={i}
                className={`${styles.row} ${row.state === "now" ? styles.now : ""} ${
                  row.state === "done" ? styles.done : ""
                }`}
              >
                <span className={styles.time}>{row.time}</span>
                <div className={styles.rowBody}>
                  <div className={styles.rowName}>{row.name}</div>
                  <div className={styles.rowReason}>
                    {row.reason}
                    {row.state === "now" ? " · עכשיו" : ""}
                  </div>
                </div>
                {row.state === "now" ? (
                  <Link to={visitPath(1)} className={styles.openBtn}>
                    פתח ביקור
                  </Link>
                ) : row.state === "done" ? (
                  <StatusBadge status="completed" />
                ) : (
                  <StatusBadge status="scheduled" />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default AgendaPage;
