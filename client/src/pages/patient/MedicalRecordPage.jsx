import { useState } from "react";
import { Tabs, StatusBadge, FileRow, Button } from "../../components/ui";
import { Icon } from "../../components/icons";
import { medicalRecord } from "../../data/mock";
import styles from "./MedicalRecordPage.module.css";

const TABS = [
  { key: "visits", label: "ביקורים" },
  { key: "prescriptions", label: "מרשמים" },
  { key: "documents", label: "מסמכים" },
];

/**
 * MedicalRecordPage (מסך 5) — תיק רפואי: ביקורים, מרשמים, מסמכים.
 * נתונים מ-data/mock. TODO: recordService.get(patientId) שמחזיר
 * visits/prescriptions/documents; העלאת מסמך → POST /api/documents.
 */
export function MedicalRecordPage() {
  const [tab, setTab] = useState("visits");
  const { patient, visits, prescriptions, documents } = medicalRecord;

  return (
    <>
      {/* כותרת עם פרטי המטופל */}
      <header className={styles.header}>
        <h1 className={styles.title}>תיק רפואי</h1>
        <div className={styles.metaRow}>
          <span className={styles.meta}>
            סוג דם: <strong>{patient.bloodType}</strong>
          </span>
          <span className={styles.meta}>
            גיל: <strong>{patient.age}</strong>
          </span>
          <span className={styles.allergy}>
            <Icon name="alertTriangle" size={14} />
            אלרגיות: {patient.allergies.join(", ")}
          </span>
        </div>
      </header>

      <div className={styles.body}>
        {/* עמודה ראשית */}
        <div className={styles.main}>
          <Tabs tabs={TABS} value={tab} onChange={setTab} className={styles.tabs} />

          {tab === "visits" && (
            <div className={styles.cards}>
              {visits.map((v) => (
                <div key={v.id} className={styles.visitCard}>
                  <div className={styles.visitHead}>
                    <div>
                      <div className={styles.visitDoctor}>{v.doctor}</div>
                      <div className={styles.visitMeta}>
                        {v.department} · {v.dateLabel}
                      </div>
                    </div>
                    <StatusBadge status="completed" />
                  </div>
                  <p className={styles.visitText}>
                    <strong>אבחנה:</strong> {v.diagnosis}
                    <br />
                    <strong>סיכום:</strong> {v.summary}
                  </p>
                  <div className={styles.visitTags}>
                    <span className={styles.tag}>
                      <Icon name="pill" size={13} />
                      {v.prescriptionsCount} מרשמים
                    </span>
                    <span className={styles.tag}>
                      <Icon name="file" size={13} />
                      {v.documentsCount} מסמכים
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "prescriptions" && (
            <div className={styles.cards}>
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  className={`${styles.rxRow} ${p.active ? styles.rxActive : styles.rxEnded}`}
                >
                  <div>
                    <div className={styles.rxName}>{p.name}</div>
                    <div className={styles.rxDosage}>{p.dosage}</div>
                  </div>
                  <StatusBadge status={p.active ? "scheduled" : "no_show"} dot={false} />
                </div>
              ))}
            </div>
          )}

          {tab === "documents" && (
            <div className={styles.cards}>
              {documents.map((d) => (
                <FileRow key={d.id} name={d.name} kind={d.kind} meta={d.meta} />
              ))}
            </div>
          )}
        </div>

        {/* עמודה צדדית */}
        <aside className={styles.aside}>
          <div className={styles.asideCard}>
            <div className={styles.asideTitle}>מרשמים פעילים</div>
            <div className={styles.rxList}>
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  className={`${styles.rxMini} ${p.active ? styles.rxMiniActive : styles.rxMiniEnded}`}
                >
                  <div className={styles.rxName}>{p.name}</div>
                  <div className={styles.rxDosage}>{p.dosage}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.asideCard}>
            <div className={styles.asideHead}>
              <span className={styles.asideTitle}>מסמכים</span>
              <Button variant="secondary" size="sm" iconStart={<Icon name="plus" size={13} stroke={2.6} />}>
                העלאה
              </Button>
            </div>
            <div className={styles.docList}>
              {documents.map((d) => (
                <FileRow key={d.id} name={d.name} kind={d.kind} meta={d.meta} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default MedicalRecordPage;
