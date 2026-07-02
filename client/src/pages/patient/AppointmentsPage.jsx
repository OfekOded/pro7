import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Topbar } from "../../components/layout";
import { Button, Chip, StatusBadge, Modal, EmptyState, PageLoader } from "../../components/ui";
import { Icon } from "../../components/icons";
import { PATHS } from "../../lib/paths";
import { STATUS_ORDER, statusMeta } from "../../lib/statuses";
import { useFetch } from "../../hooks/useFetch";
import { appointmentService } from "../../services/appointmentService";
import styles from "./AppointmentsPage.module.css";

/**
 * AppointmentsPage (מסך 4) — רשימת כל התורים עם סינון לפי סטטוס.
 *
 * ✦ שדרוגי חוויה: סינון מונפש (כניסה מדורגת), מודאל אישור לביטול תור,
 *   עדכון חי של המונים, מצב ריק, וטוסט אישור.
 *
 * הנתונים נשלפים דרך appointmentService (GET /appointments); ביטול מתבצע
 * מול ה-API (PATCH) — כישלון מוצג בטוסט והרשימה לא משתנה.
 */
export function AppointmentsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useFetch(() => appointmentService.list(), []);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const counts = useMemo(() => {
    const c = { all: items.length };
    for (const s of STATUS_ORDER) c[s] = items.filter((a) => a.status === s).length;
    return c;
  }, [items]);

  const visible = filter === "all" ? items : items.filter((a) => a.status === filter);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const confirmCancel = async () => {
    const target = cancelTarget;
    setCancelTarget(null);
    try {
      await appointmentService.cancel(target.id);
      setItems((list) =>
        list.map((a) => (a.id === target.id ? { ...a, status: "cancelled" } : a))
      );
      setToast(`התור עם ${target.doctor} בוטל`);
    } catch (err) {
      setToast(err.message || "הביטול נכשל — נסו שוב");
    }
  };

  const rowActions = (a) => {
    switch (a.status) {
      case "scheduled":
        return (
          <>
            <Button variant="outline" size="sm">
              פרטים
            </Button>
            <Button variant="danger" size="sm" onClick={() => setCancelTarget(a)}>
              ביטול
            </Button>
          </>
        );
      case "completed":
        return (
          <Button variant="outline" size="sm">
            צפייה בסיכום
          </Button>
        );
      case "cancelled":
      case "no_show":
        return (
          <Button variant="danger" size="sm" onClick={() => navigate(PATHS.book)}>
            קבע מחדש
          </Button>
        );
      default:
        return null;
    }
  };

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

        {/* רשימה (מונפשת מחדש בכל שינוי פילטר) */}
        {isLoading ? (
          <PageLoader label="טוען תורים…" />
        ) : visible.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="אין תורים בקטגוריה הזו"
            description="כשיהיו תורים במצב שבחרת, הם יופיעו כאן."
            action={
              <Button size="sm" onClick={() => navigate(PATHS.book)}>
                לקביעת תור
              </Button>
            }
          />
        ) : (
          <div className={styles.list} key={filter}>
            {visible.map((a, i) => (
              <div key={a.id} className={styles.row} style={{ "--i": i }}>
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
                <div className={styles.actions}>{rowActions(a)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* מודאל אישור ביטול */}
      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="ביטול תור"
        footer={
          <>
            <Button variant="danger" onClick={confirmCancel}>
              כן, בטל/י את התור
            </Button>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              חזרה
            </Button>
          </>
        }
      >
        {cancelTarget ? (
          <>
            לבטל את התור עם <strong>{cancelTarget.doctor}</strong> ({cancelTarget.department})
            בתאריך {cancelTarget.day} ב{cancelTarget.month}?
            <br />
            ניתן לבטל ללא חיוב עד 24 שעות לפני המועד.
          </>
        ) : null}
      </Modal>

      {/* טוסט אישור */}
      {toast ? (
        <div className={styles.toast} role="status">
          <Icon name="checkCircle" size={18} />
          {toast}
        </div>
      ) : null}
    </>
  );
}

export default AppointmentsPage;
