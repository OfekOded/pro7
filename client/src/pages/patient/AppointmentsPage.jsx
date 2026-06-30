import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Topbar } from "../../components/layout";
import { Button, Chip, StatusBadge } from "../../components/ui";
import { Icon } from "../../components/icons";
import { PATHS } from "../../lib/paths";
import { STATUS_ORDER, statusMeta } from "../../lib/statuses";
import { appointments } from "../../data/mock";
import styles from "./AppointmentsPage.module.css";

/** הפעולות המוצגות לכל שורה לפי סטטוס התור. */
function rowActions(status) {
  switch (status) {
    case "scheduled":
      return (
        <>
          <Button variant="outline" size="sm">פרטים</Button>
          <Button variant="danger" size="sm">ביטול</Button>
        </>
      );
    case "completed":
      return <Button variant="outline" size="sm">צפייה בסיכום</Button>;
    case "cancelled":
    case "no_show":
      return <Button variant="danger" size="sm">קבע מחדש</Button>;
    default:
      return null;
  }
}

/**
 * AppointmentsPage (מסך 4) — רשימת כל התורים עם סינון לפי סטטוס.
 * הסינון מתבצע מקומית על נתוני ה-mock.
 * TODO: למשוך מ-appointmentService.list({status}); פעולות (ביטול/קביעה מחדש)
 *       יקראו ל-API המתאים ויעדכנו את הרשימה.
 */
export function AppointmentsPage() {
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const c = { all: appointments.length };
    for (const s of STATUS_ORDER) c[s] = appointments.filter((a) => a.status === s).length;
    return c;
  }, []);

  const visible =
    filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <>
      <Topbar
        title="התורים שלי"
        actions={
          <Link to={PATHS.book}>
            <Button size="sm" iconStart={<Icon name="plus" size={15} stroke={2.6} />}>
              תור חדש
            </Button>
          </Link>
        }
      />

      <div className={styles.body}>
        {/* צ׳יפים לסינון */}
        <div className={styles.filters}>
          <Chip label="הכל" count={counts.all} active={filter === "all"} onClick={() => setFilter("all")} />
          {STATUS_ORDER.map((s) => (
            <Chip
              key={s}
              label={statusMeta(s).label}
              count={counts[s]}
              dotColor={statusMeta(s).dot}
              active={filter === s}
              onClick={() => setFilter(s)}
            />
          ))}
        </div>

        {/* רשימה */}
        <div className={styles.list}>
          {visible.map((a) => (
            <div key={a.id} className={styles.row}>
              <span className={`${styles.dateBox} ${styles[`tone-${a.status}`]}`}>
                <span className={styles.dateDay}>{a.day}</span>
                <span className={styles.dateMonth}>{a.month}</span>
              </span>
              <div className={styles.info}>
                <div className={styles.doctor}>
                  {a.doctor} · {a.department}
                </div>
                <div className={styles.meta}>{a.meta}</div>
              </div>
              <StatusBadge status={a.status} />
              <div className={styles.actions}>{rowActions(a.status)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AppointmentsPage;
