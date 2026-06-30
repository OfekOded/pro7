import { Link } from "react-router-dom";
import { Topbar } from "../../components/layout";
import { StatusBadge } from "../../components/ui";
import { Icon } from "../../components/icons";
import { PATHS } from "../../lib/paths";
import { currentPatient, nextAppointment, appointments } from "../../data/mock";
import styles from "./DashboardPage.module.css";

const QUICK_ACTIONS = [
  { to: PATHS.book, icon: "plus", title: "זימון תור", desc: "קבע/י תור חדש", primary: true },
  { to: PATHS.appointments, icon: "calendar", title: "התורים שלי", desc: "2 תורים פעילים", tone: "brand" },
  { to: PATHS.record, icon: "file", title: "תיק רפואי", desc: "ביקורים ומרשמים", tone: "green" },
  { to: PATHS.record, icon: "upload", title: "מסמכים", desc: "העלאה וצפייה", tone: "gray" },
];

/**
 * DashboardPage (מסך 2) — דשבורד מטופל.
 * נחיתה אחרי כניסה: התור הקרוב, פעולות מהירות, והתורים הקרובים.
 * נתונים מ-data/mock. TODO: למשוך מ-services (appointmentService.getUpcoming).
 */
export function DashboardPage() {
  const upcoming = appointments.filter((a) => a.status === "scheduled");

  return (
    <>
      <Topbar
        title={`שלום, ${currentPatient.fullName.split(" ")[0]} 👋`}
        subtitle="יום ראשון, 9 ביולי 2026"
        search
        bell
      />

      <div className={styles.body}>
        {/* כרטיס התור הקרוב */}
        <div className={styles.hero}>
          <div className={styles.heroBlob} />
          <div className={styles.heroMain}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              התור הקרוב · {nextAppointment.countdown}
            </div>
            <div className={styles.heroTitle}>
              {nextAppointment.doctor} · {nextAppointment.department}
            </div>
            <div className={styles.heroMeta}>
              <span>
                <Icon name="calendar" size={16} />
                {nextAppointment.dateLabel}
              </span>
              <span>
                <Icon name="clock" size={16} />
                {nextAppointment.time}
              </span>
              <span>
                <Icon name="mapPin" size={16} />
                חדר {nextAppointment.room}
              </span>
            </div>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.heroBtnSolid}>צפייה בפרטים</button>
            <button className={styles.heroBtnGhost}>ביטול תור</button>
          </div>
        </div>

        {/* פעולות מהירות */}
        <section>
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
        <section>
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
