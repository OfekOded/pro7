import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Textarea, Field, Avatar, Dropzone, Modal } from "../../components/ui";
import { Icon } from "../../components/icons";
import { PATHS } from "../../lib/paths";
import { visitContext } from "../../data/mock";
import styles from "./VisitPage.module.css";

// מרשמים פותחים (טיוטה). נשמרים ב-state כדי לאפשר הוספה/מחיקה חיה.
const INITIAL_PRESCRIPTIONS = [
  { id: 1, name: "Ramipril 5mg", dosage: "פעם ביום בבוקר · 30 יום" },
  { id: 2, name: "Aspirin 100mg", dosage: "פעם ביום אחרי ארוחה · קבוע" },
];

/**
 * VisitPage (מסך 7) — מסך ביקור: תיעוד ע״י הרופא/ה.
 *
 * ✦ שדרוגי חוויה: מרשמים אינטראקטיביים (הוספה/מחיקה), חיווי "טיוטה נשמרה",
 *   ומודאל אישור לסגירת ביקור. שדות התיעוד נשלטים (controlled).
 *
 * TODO (שלב הלוגיקה):
 *  - לטעון את הביקור לפי :id, "סגור ביקור" → POST /api/visits + מרשמים מקושרים.
 *  - "צירוף מסמך" → העלאה מול POST /api/documents (multipart).
 */
export function VisitPage() {
  const navigate = useNavigate();
  const { patient, vitals, allergies, recentVisits } = visitContext;

  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", dosage: "" });
  const [diagnosis, setDiagnosis] = useState("יתר לחץ דם ראשוני (I10) — מאוזן");
  const [summary, setSummary] = useState(
    "המטופלת מגיעה למעקב שגרתי. מדווחת על הרגשה טובה ללא תלונות. ערכי לחץ הדם תקינים תחת הטיפול הנוכחי. הומלץ להמשיך טיפול ולשמור על תזונה דלת מלח."
  );
  const [draftSaved, setDraftSaved] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    if (!draftSaved) return;
    const id = setTimeout(() => setDraftSaved(false), 2500);
    return () => clearTimeout(id);
  }, [draftSaved]);

  const addPrescription = () => {
    if (!draft.name.trim()) return;
    setPrescriptions((list) => [...list, { id: Date.now(), name: draft.name.trim(), dosage: draft.dosage.trim() }]);
    setDraft({ name: "", dosage: "" });
    setAdding(false);
  };

  const removePrescription = (id) => setPrescriptions((list) => list.filter((p) => p.id !== id));

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
          {draftSaved ? (
            <span className={styles.savedPill}>
              <Icon name="check" size={14} stroke={3} />
              טיוטה נשמרה
            </span>
          ) : null}
          <Button variant="outline" onClick={() => setDraftSaved(true)}>
            שמור טיוטה
          </Button>
          <Button iconStart={<Icon name="check" size={15} stroke={2.6} />} onClick={() => setConfirmClose(true)}>
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
              <Input id="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </Field>
            <Field label="סיכום ביקור" htmlFor="summary">
              <Textarea id="summary" rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} />
            </Field>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.sectionTitle}>מרשמים</h2>
              <Button
                variant="secondary"
                size="sm"
                iconStart={<Icon name="plus" size={13} stroke={2.6} />}
                onClick={() => setAdding((v) => !v)}
              >
                הוסף מרשם
              </Button>
            </div>

            <div className={styles.rxList}>
              {prescriptions.map((p) => (
                <div key={p.id} className={styles.rxRow}>
                  <span className={styles.rxIcon}>
                    <Icon name="pill" size={17} />
                  </span>
                  <div className={styles.rxInfo}>
                    <div className={styles.rxName}>{p.name}</div>
                    <div className={styles.rxDosage}>{p.dosage}</div>
                  </div>
                  <button
                    className={styles.rxDelete}
                    aria-label={`מחיקת ${p.name}`}
                    onClick={() => removePrescription(p.id)}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))}
              {prescriptions.length === 0 ? (
                <div className={styles.rxEmpty}>אין מרשמים. הוסף/י מרשם חדש.</div>
              ) : null}
            </div>

            {adding ? (
              <div className={styles.rxAddForm}>
                <Input
                  placeholder="שם התרופה ומינון (למשל Ramipril 5mg)"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  autoFocus
                />
                <Input
                  placeholder="הוראות נטילה (למשל פעם ביום · 30 יום)"
                  value={draft.dosage}
                  onChange={(e) => setDraft((d) => ({ ...d, dosage: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addPrescription()}
                />
                <div className={styles.rxAddActions}>
                  <Button size="sm" onClick={addPrescription} disabled={!draft.name.trim()}>
                    הוספה
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
                    ביטול
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>צירוף מסמך</h2>
            <Dropzone hint="גרור/י קובץ או בחר/י" accept="תוצאות בדיקה, צילום · PDF/JPG/PNG" />
          </div>
        </div>
      </div>

      {/* מודאל אישור סגירת ביקור */}
      <Modal
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        title="סגירת ביקור"
        footer={
          <>
            <Button onClick={() => navigate(PATHS.doctorAgenda)}>אישור וסגירה</Button>
            <Button variant="outline" onClick={() => setConfirmClose(false)}>
              חזרה לעריכה
            </Button>
          </>
        }
      >
        סגירת הביקור תשמור את התיעוד ({prescriptions.length} מרשמים) ותסמן את התור כהושלם.
        לא ניתן יהיה לערוך לאחר מכן.
      </Modal>
    </div>
  );
}

export default VisitPage;
