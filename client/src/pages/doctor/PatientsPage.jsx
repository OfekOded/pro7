import { useState } from "react";
import { Topbar } from "../../components/layout";
import { Button, Avatar, EmptyState } from "../../components/ui";
import { Icon } from "../../components/icons";
import { doctorPatients } from "../../data/mock";
import styles from "./PatientsPage.module.css";

/**
 * PatientsPage (רופא/ה) — רשימת המטופלים של הרופא/ה.
 *
 * ✦ מסך מלא: חיפוש, כרטיסי מטופלים עם ביקור אחרון/תור הבא, וכניסה מדורגת.
 *   נתונים מ-mock. TODO: doctorService — GET /api/doctors/me/patients.
 */
export function DoctorPatientsPage() {
  const [q, setQ] = useState("");
  const visible = doctorPatients.filter((p) => !q || p.name.includes(q));

  return (
    <>
      <Topbar
        title="המטופלים שלי"
        actions={<span className={styles.total}>{doctorPatients.length} מטופלים</span>}
      />

      <div className={styles.body}>
        <div className={styles.search}>
          <Icon name="search" size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="חיפוש מטופל/ת לפי שם…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {visible.length === 0 ? (
          <EmptyState icon="users" title="לא נמצאו מטופלים" description="נסה/י חיפוש אחר." />
        ) : (
          <div key={q} className={styles.grid}>
            {visible.map((p, i) => (
              <div key={p.id} className={styles.card} style={{ "--i": i }}>
                <div className={styles.cardHead}>
                  <Avatar initial={p.initial} size={48} tone="brand" />
                  <div className={styles.who}>
                    <div className={styles.name}>{p.name}</div>
                    <div className={styles.age}>בן/בת {p.age}</div>
                  </div>
                </div>
                <div className={styles.condition}>
                  <Icon name="activity" size={13} />
                  {p.condition}
                </div>
                <div className={styles.rows}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaKey}>ביקור אחרון</span>
                    <span className={styles.metaVal}>{p.lastVisit}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.metaKey}>תור הבא</span>
                    <span className={styles.metaVal}>{p.next}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" block iconStart={<Icon name="fileText" size={14} />}>
                  צפייה בתיק
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DoctorPatientsPage;
