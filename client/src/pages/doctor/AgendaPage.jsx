import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Topbar } from "../../components/layout";
import { StatusBadge, Avatar, PageLoader } from "../../components/ui";
import { Icon } from "../../components/icons";
import { visitPath } from "../../lib/paths";
import { useFetch } from "../../hooks/useFetch";
import { doctorService } from "../../services/doctorService";
import styles from "./AgendaPage.module.css";

const VALUE_COLOR = {
  brand: "var(--brand-ink)",
  green: "var(--green-ink)",
  amber: "var(--amber-ink)",
  accent: "var(--accent-ink)",
};

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** מספר שמטפס מ-0 ליעד; fallback ב-setTimeout מבטיח ערך סופי גם אם rAF מווסת. */
function useCountUp(target, duration = 800) {
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
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    const safety = setTimeout(() => setVal(target), duration + 250);
    return () => {
      cancelAnimationFrame(ref.current);
      clearTimeout(safety);
    };
  }, [target, duration]);
  return Math.round(val);
}

function StatNum({ value }) {
  return <>{useCountUp(value)}</>;
}

/** שעון חי — מתעדכן כל שנייה. */
function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return (
    <span className={styles.clock} aria-label="השעה הנוכחית">
      <Icon name="clock" size={15} />
      <span className={styles.clockTime}>
        {hh}:{mm}:{ss}
      </span>
    </span>
  );
}

/**
 * AgendaPage (מסך 6) — דשבורד רופא/ה: אג׳נדת היום.
 *
 * ✦ שדרוגי חוויה: מספרים שמטפסים בכרטיסי הסטטיסטיקה, שעון חי בבר העליון,
 *   פס התקדמות יומי (הושלמו/סה״כ), כניסה מדורגת לציר הזמן, ושורת "עכשיו" פועמת.
 *
 * הנתונים נשלפים דרך doctorService (GET /doctors/me/agenda).
 */
export function AgendaPage() {
  const { data, isLoading } = useFetch(() => doctorService.agenda("2026-07-12"), []);

  if (isLoading || !data) return <PageLoader label="טוען אג׳נדה…" />;

  const { greeting, dateLabel, stats, nextPatient, timeline } = data;
  // ההתקדמות נגזרת מכרטיסי הסטטיסטיקה כדי להישאר עקבית עם המספרים המוצגים.
  const total = stats.find((s) => s.id === "today")?.value ?? timeline.length;
  const done = stats.find((s) => s.id === "done")?.value ?? 0;
  const progress = Math.round((done / total) * 100);

  return (
    <>
      <Topbar title={`${greeting} ☀️`} subtitle={`${dateLabel} · 8 תורים היום`} actions={<LiveClock />} bell />

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
                <StatNum value={s.value} />
              </div>
            </div>
          ))}
        </div>

        {/* התקדמות היום */}
        <div className={styles.progressCard}>
          <div className={styles.progressHead}>
            <span className={styles.progressTitle}>התקדמות היום</span>
            <span className={styles.progressCount}>
              {done} מתוך {total} הושלמו
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
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
                style={{ "--i": i }}
                className={`${styles.row} ${styles.rowIn} ${row.state === "now" ? styles.now : ""} ${
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
