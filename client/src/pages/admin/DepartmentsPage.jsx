import { useEffect, useState } from "react";
import { Topbar } from "../../components/layout";
import { Button, Modal } from "../../components/ui";
import { Icon } from "../../components/icons";
import { departments as seedDepartments } from "../../data/mock";
import styles from "./DepartmentsPage.module.css";

/**
 * DepartmentsPage (מנהל/ת) — ניהול מחלקות.
 *
 * ✦ גריד כרטיסי מחלקות עם אייקון, מונה רופאים, ופעולות. מחיקה עם מודאל אישור + טוסט.
 *   נתונים מ-mock (עותק מקומי). TODO: CRUD מחלקות מול /api/departments (admin).
 */
export function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState(seedDepartments);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const totalDoctors = departments.reduce((sum, d) => sum + d.doctorsCount, 0);

  const confirmRemove = () => {
    setDepartments((list) => list.filter((d) => d.id !== removeTarget.id));
    setToast(`המחלקה "${removeTarget.name}" נמחקה`);
    setRemoveTarget(null);
  };

  return (
    <>
      <Topbar
        title="ניהול מחלקות"
        actions={
          <Button size="sm" iconStart={<Icon name="plus" size={15} stroke={2.6} />}>
            מחלקה חדשה
          </Button>
        }
      />

      <div className={styles.body}>
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{departments.length}</span>
            <span className={styles.summaryLabel}>מחלקות</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{totalDoctors}</span>
            <span className={styles.summaryLabel}>רופאים בסך הכל</span>
          </div>
        </div>

        <div className={styles.grid}>
          {departments.map((d, i) => (
            <div key={d.id} className={styles.card} style={{ "--i": i }}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>
                  <Icon name={d.icon} size={24} />
                </span>
                <button
                  className={styles.delete}
                  aria-label={`מחיקת ${d.name}`}
                  onClick={() => setRemoveTarget(d)}
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
              <div className={styles.name}>{d.name}</div>
              <div className={styles.count}>
                <Icon name="stethoscope" size={13} />
                {d.doctorsCount} רופאים
              </div>
              <Button variant="outline" size="sm" block className={styles.editBtn}>
                עריכת מחלקה
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        title="מחיקת מחלקה"
        footer={
          <>
            <Button variant="danger" onClick={confirmRemove}>
              כן, מחק/י
            </Button>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              חזרה
            </Button>
          </>
        }
      >
        {removeTarget ? (
          <>
            למחוק את מחלקת <strong>{removeTarget.name}</strong> ({removeTarget.doctorsCount} רופאים)?
            <br />
            לא ניתן למחוק מחלקה עם תורים פעילים.
          </>
        ) : null}
      </Modal>

      {toast ? (
        <div className={styles.toast} role="status">
          <Icon name="checkCircle" size={18} />
          {toast}
        </div>
      ) : null}
    </>
  );
}

export default AdminDepartmentsPage;
