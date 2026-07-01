import { useMemo, useState } from "react";
import { Topbar } from "../../components/layout";
import { Button, Chip, Avatar, EmptyState } from "../../components/ui";
import { Icon } from "../../components/icons";
import { doctors, departments } from "../../data/mock";
import styles from "./DoctorsPage.module.css";

const deptName = (id) => departments.find((d) => d.id === id)?.name ?? "—";

/**
 * DoctorsPage (מנהל/ת) — ניהול רופאים.
 *
 * ✦ גריד כרטיסי רופאים עם סינון לפי מחלקה (מונים), באדג׳ זמינות, ופעולות.
 *   נתונים מ-mock. TODO: adminService (CRUD רופאים) מול /api/doctors.
 */
export function AdminDoctorsPage() {
  const [dept, setDept] = useState("all");

  const counts = useMemo(() => {
    const c = { all: doctors.length };
    for (const d of departments) c[d.id] = doctors.filter((doc) => doc.departmentId === d.id).length;
    return c;
  }, []);

  const visible = dept === "all" ? doctors : doctors.filter((d) => d.departmentId === dept);

  return (
    <>
      <Topbar
        title="ניהול רופאים"
        actions={
          <Button size="sm" iconStart={<Icon name="plus" size={15} stroke={2.6} />}>
            רופא/ה חדש/ה
          </Button>
        }
      />

      <div className={styles.body}>
        <div className={styles.filters}>
          <Chip label="הכל" count={counts.all} active={dept === "all"} onClick={() => setDept("all")} />
          {departments.map((d) => (
            <Chip
              key={d.id}
              label={d.name}
              count={counts[d.id]}
              active={dept === d.id}
              onClick={() => setDept(d.id)}
            />
          ))}
        </div>

        {visible.length === 0 ? (
          <EmptyState icon="stethoscope" title="אין רופאים במחלקה זו" />
        ) : (
          <div key={dept} className={styles.grid}>
            {visible.map((d, i) => (
              <div key={d.id} className={styles.card} style={{ "--i": i }}>
                <div className={styles.cardTop}>
                  <Avatar initial={d.initial} size={52} tone="green" />
                  <span
                    className={`${styles.avail} ${d.availability === "free" ? styles.free : styles.busy}`}
                  >
                    <span className={styles.availDot} />
                    {d.availability === "free" ? "פנוי/ה" : "עומס"}
                  </span>
                </div>
                <div className={styles.name}>{d.name}</div>
                <div className={styles.specialty}>{d.specialty}</div>
                <div className={styles.meta}>
                  <span className={styles.deptBadge}>{deptName(d.departmentId)}</span>
                  <span className={styles.room}>
                    <Icon name="mapPin" size={13} />
                    חדר {d.room}
                  </span>
                </div>
                <div className={styles.actions}>
                  <Button variant="outline" size="sm" block>
                    עריכה
                  </Button>
                  <Button variant="secondary" size="sm" block>
                    פרופיל
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDoctorsPage;
