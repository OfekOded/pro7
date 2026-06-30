import { useNavigate } from "react-router-dom";
import { Button, Input, Textarea, Field, Avatar, Dropzone } from "../../components/ui";
import { Icon } from "../../components/icons";
import { PATHS } from "../../lib/paths";
import { visitContext } from "../../data/mock";
import styles from "./VisitPage.module.css";

// מרשמים שהרופא/ה הזין/ה בביקור (טיוטה). TODO: ניהול ב-state + POST /prescriptions.
const DRAFT_PRESCRIPTIONS = [
  { id: 1, name: "Ramipril 5mg", dosage: "פעם ביום בבוקר · 30 יום" },
  { id: 2, name: "Aspirin 100mg", dosage: "פעם ביום אחרי ארוחה · קבוע" },
];

/**
 * VisitPage (מסך 7) — מסך ביקור: תיעוד ע״י הרופא/ה.
 * נתונים מ-data/mock. השדות כאן תצוגתיים (defaultValue).
 *
 * TODO (שלב הלוגיקה):
 *  - לטעון את הביקור לפי :id (recordService/appointmentService).
 *  - "סגור ביקור" → POST /api/visits (יוצר רשומת visit) + שמירת מרשמים מקושרים.
 *  - "צירוף מסמך" → העלאת קובץ מול POST /api/documents (multipart).
 */
export function VisitPage() {
  const navigate = useNavigate();
  const { patient, vitals, allergies, recentVisits } = visitContext;

  return (
    <div className={styles.wrap}>
      {/* בר עליון */}
      <header className={styles.header}>
        <div className={styles.headLeft}>
          <button className={styles.back} onClick={() => navigate(-1)} aria-label="חזרה">
            <Icon name="chevronRight" size={18} stroke={2.4} />
          </button>
          <Avatar initial={patient.initial} size={46} tone="brand" />
          <div>
            <div className={styles.patientName}>{patient.name}</div>
            <div className={styles.patientMeta}>
              בת {patient.age} · ת.ז {patient.nationalId} · תור {patient.appointmentTime}
            </div>
          </div>
        </div>
        <div className={styles.headActions}>
          <Button variant="outline">שמור טיוטה</Button>
          <Button
            iconStart={<Icon name="check" size={15} stroke={2.6} />}
            onClick={() => navigate(PATHS.doctorAgenda)}
          >
            סגור ביקור
          </Button>
        </div>
      </header>

      <div className={styles.body}>
        {/* עמודה צדדית */}
        <aside className={styles.aside}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>מדדים אחרונים</div>
            <div className={styles.vitals}>
              {vitals.map((v) => (
                <div key={v.label} className={styles.vitalRow}>
                  <span className={styles.vitalLabel}>{v.label}</span>
                  <span className={styles.vitalValue}>{v.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.allergyCard}>
            <div className={styles.allergyTitle}>
              <Icon name="alertTriangle" size={15} />
              אלרגיות
            </div>
            <div className={styles.allergyText}>{allergies.join(", ")}</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>ביקורים אחרונים</div>
            <div className={styles.recentList}>
              {recentVisits.map((r, i) => (
                <div key={i} className={styles.recentItem}>
                  <div className={styles.recentDate}>{r.dateLabel}</div>
                  <div className={styles.recentSummary}>{r.summary}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* עמודה ראשית */}
        <div className={styles.main}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>תיעוד הביקור</h2>
            <Field label="אבחנה" htmlFor="diagnosis" className={styles.field}>
              <Input id="diagnosis" defaultValue="יתר לחץ דם ראשוני (I10) — מאוזן" />
            </Field>
            <Field label="סיכום ביקור" htmlFor="summary">
              <Textarea
                id="summary"
                rows={4}
                defaultValue="המטופלת מגיעה למעקב שגרתי. מדווחת על הרגשה טובה ללא תלונות. ערכי לחץ הדם תקינים תחת הטיפול הנוכחי. הומלץ להמשיך טיפול ולשמור על תזונה דלת מלח."
              />
            </Field>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.sectionTitle}>מרשמים</h2>
              <Button variant="secondary" size="sm" iconStart={<Icon name="plus" size={13} stroke={2.6} />}>
                הוסף מרשם
              </Button>
            </div>
            <div className={styles.rxList}>
              {DRAFT_PRESCRIPTIONS.map((p) => (
                <div key={p.id} className={styles.rxRow}>
                  <span className={styles.rxIcon}>
                    <Icon name="pill" size={17} />
                  </span>
                  <div className={styles.rxInfo}>
                    <div className={styles.rxName}>{p.name}</div>
                    <div className={styles.rxDosage}>{p.dosage}</div>
                  </div>
                  <button className={styles.rxDelete} aria-label="מחיקת מרשם">
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>צירוף מסמך</h2>
            <Dropzone hint="גרור/י קובץ או בחר/י" accept="תוצאות בדיקה, צילום · PDF/JPG/PNG" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitPage;
