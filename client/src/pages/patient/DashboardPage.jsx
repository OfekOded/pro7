import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Topbar } from "../../components/layout";
import { StatusBadge } from "../../components/ui";
import { Icon } from "../../components/icons";
import { PATHS } from "../../lib/paths";
import { formatDayDateHe, formatTime } from "../../utils/format";
import { currentPatient, nextAppointment, appointments } from "../../data/mock";
import styles from "./DashboardPage.module.css";

const QUICK_ACTIONS = [
  { to: PATHS.book, icon: "plus", title: "זימון תור", desc: "קבע/י תור חדש", primary: true },
  { to: PATHS.appointments, icon: "calendar", title: "התורים שלי", desc: "2 תורים פעילים", tone: "brand" },
  { to: PATHS.record, icon: "file", title: "תיק רפואי", desc: "ביקורים ומרשמים", tone: "green" },
  { to: PATHS.record, icon: "upload", title: "מסמכים", desc: "העלאה וצפייה", tone: "gray" },
];

/** ברכה לפי שעת היום. */
function greetingFor(hour) {
  if (hour < 12) return "בוקר טוב";
  if (hour < 18) return "צהריים טובים";
  return "ערב טוב";
}

/** מפרק הפרש זמן (ms) ליחידות. */
function breakdown(ms) {
  const clamp = Math.max(0, ms);
  return {
    days: Math.floor(clamp / 86400000),
    hours: Math.floor((clamp / 3600000) % 24),
    minutes: Math.floor((clamp / 60000) % 60),
    seconds: Math.floor((clamp / 1000) % 60),
  };
}

const pad = (n) => String(n).padStart(2, "0");

/** ספירה-לאחור חיה — מתעדכנת כל שנייה. */
function Countdown({ target }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = breakdown(target.getTime() - now);
  const cells = [
    { v: t.days, label: "ימים" },
    { v: pad(t.hours), label: "שעות" },
    { v: pad(t.minutes), label: "דקות" },
    { v: pad(t.seconds), label: "שניות" },
  ];

  return (
    <div className={styles.countdown} role="timer" aria-label="זמן עד התור הקרוב">
      {cells.map((c, i) => (
        <div className={styles.cdCell} key={i}>
          <span className={styles.cdValue}>{c.v}</span>
          <span className={styles.cdLabel}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * DashboardPage (מסך 2) — דשבורד מטופל.
 * נחיתה אחרי כניסה: התור הקרוב (עם ספירה-לאחור חיה), פעולות מהירות, ותורים קרובים.
 *
 * ✦ שדרוגי חוויה: ברכה לפי שעת היום, ספירה-לאחור מתקתקת בזמן אמת,
 *   וכניסה מדורגת. התאריך/שעה נגזרים מ-utils/format כדי להדגים את שכבת העזרים.
 *
 * TODO: למשוך מ-services (appointmentService.getUpcoming); כרגע נתוני mock.
 */
export function DashboardPage() {
  const upcoming = appointments.filter((a) => a.status === "scheduled");

  // יעד התור הקרוב — מחושב יחסית ל"עכשיו" כדי שהספירה תהיה חיה ועקבית בכל הרצה.
  const target = useMemo(() => new Date(Date.now() + 3 * 86400000 + 4 * 3600000 + 12 * 60000), []);
  const now = new Date();
  const greeting = greetingFor(now.getHours());

  return (
    <>
      <Topbar
        title={`${greeting}, ${currentPatient.fullName.split(" ")[0]} 👋`}
        subtitle={formatDayDateHe(now)}
        search
        bell
      />

      <div className={styles.body}>
        {/* כרטיס התור הקרוב */}
        <div className={`${styles.hero} ${styles.rise}`} style={{ "--i": 0 }}>
          <div className={styles.heroBlob} />
          <div className={styles.heroMain}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              התור הקרוב
            </div>
            <div className={styles.heroTitle}>
              {nextAppointment.doctor} · {nextAppointment.department}
            </div>
            <div className={styles.heroMeta}>
              <span>
                <Icon name="calendar" size={16} />
                {formatDayDateHe(target)}
              </span>
              <span>
                <Icon name="clock" size={16} />
                {formatTime(target.toTimeString())}
              </span>
              <span>
                <Icon name="mapPin" size={16} />
                חדר {nextAppointment.room}
              </span>
            </div>
            <Countdown target={target} />
          </div>
          <div className={styles.heroActions}>
            <button className={styles.heroBtnSolid}>צפייה בפרטים</button>
            <button className={styles.heroBtnGhost}>ביטול תור</button>
          </div>
        </div>

        {/* פעולות מהירות */}
        <section className={styles.rise} style={{ "--i": 1 }}>
          <h2 className={styles.sectionTitle}>פעולות מהירות</h2>
          <div className={styles.quickGrid}>
            {QUICK_ACTIONS.map((a, i) => (
              <Link
                key={i}
                to={a.to}
                className={`${styles.quick} ${a.primary ? styles.quickPrimary : ""}`}
              >
                <span
                  className={`${styles.quickIcon} ${a.primary ? styles.quickIconPrimary : styles[`tone-${a.tone}`]}`}
                >
                  <Icon name={a.icon} size={20} stroke={a.primary ? 2.4 : 2} />
                </span>
                <div className={styles.quickTitle}>{a.title}</div>
                <div className={styles.quickDesc}>{a.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* התורים הקרובים */}
        <section className={styles.rise} style={{ "--i": 2 }}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>התורים הקרובים</h2>
            <Link to={PATHS.appointments} className={styles.showAll}>
              הצג הכל
            </Link>
          </div>
          <div className={styles.list}>
            {upcoming.map((a) => (
              <div key={a.id} className={styles.listRow}>
                <span className={styles.dateBox}>
                  <span className={styles.dateDay}>{a.day}</span>
                  <span className={styles.dateMonth}>{a.month}</span>
                </span>
                <div className={styles.listBody}>
                  <div className={styles.listDoctor}>{a.doctor}</div>
                  <div className={styles.listMeta}>
                    {a.department} · {a.meta.replace(/^[^·]*·\s*/, "")}
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default DashboardPage;
