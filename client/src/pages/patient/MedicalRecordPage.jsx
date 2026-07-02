import { useEffect, useState } from "react";
import { Tabs, StatusBadge, FileRow, Button, PageLoader } from "../../components/ui";
import { Icon } from "../../components/icons";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { recordService } from "../../services/recordService";
import styles from "./MedicalRecordPage.module.css";

/**
 * MedicalRecordPage (מסך 5) — תיק רפואי: ביקורים, מרשמים, מסמכים.
 *
 * ✦ שדרוגי חוויה: מוני טאבים, מעברי טאבים מונפשים, כניסה מדורגת של כרטיסים,
 *   והעלאת מסמך חיה (מוסיפה שורה + טוסט). מצב מרשמים: הכל / פעילים.
 *
 * הנתונים נשלפים דרך recordService (GET /patients/:id/record); העלאת מסמך
 * מתבצעת מול POST /api/documents (multipart) — התצוגה מתעדכנת מהתשובה.
 */
export function MedicalRecordPage() {
  const { user } = useAuth();
  const { data, isLoading } = useFetch(() => recordService.get(user.id), [user.id]);
  const [tab, setTab] = useState("visits");
  const [documents, setDocuments] = useState([]);
  const [rxFilter, setRxFilter] = useState("all"); // all | active
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (data) setDocuments(data.documents);
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const uploadDocument = async () => {
    try {
      const fd = new FormData();
      fd.append("name", `מסמך_${documents.length + 1}.pdf`);
      const doc = await recordService.uploadDocument(fd);
      setDocuments((d) => [doc, ...d]);
      setToast("המסמך הועלה לתיק");
    } catch (err) {
      setToast(err.message || "ההעלאה נכשלה — נסו שוב");
    }
  };

  if (isLoading || !data) return <PageLoader label="טוען תיק רפואי…" />;
  const { patient, visits, prescriptions } = data;

  const visibleRx = rxFilter === "active" ? prescriptions.filter((p) => p.active) : prescriptions;

  const TABS = [
    { key: "visits", label: `ביקורים · ${visits.length}` },
    { key: "prescriptions", label: `מרשמים · ${prescriptions.length}` },
    { key: "documents", label: `מסמכים · ${documents.length}` },
  ];

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

          <div key={tab} className={styles.tabPanel}>
            {tab === "visits" && (
              <div className={styles.cards}>
                {visits.map((v, i) => (
                  <div key={v.id} className={styles.visitCard} style={{ "--i": i }}>
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
              <>
                <div className={styles.rxFilters}>
                  <button
                    className={`${styles.rxFilterBtn} ${rxFilter === "all" ? styles.rxFilterActive : ""}`}
                    onClick={() => setRxFilter("all")}
                  >
                    הכל
                  </button>
                  <button
                    className={`${styles.rxFilterBtn} ${rxFilter === "active" ? styles.rxFilterActive : ""}`}
                    onClick={() => setRxFilter("active")}
                  >
                    פעילים בלבד
                  </button>
                </div>
                <div className={styles.cards}>
                  {visibleRx.map((p, i) => (
                    <div
                      key={p.id}
                      style={{ "--i": i }}
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
              </>
            )}

            {tab === "documents" && (
              <>
                <div className={styles.docHead}>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconStart={<Icon name="plus" size={13} stroke={2.6} />}
                    onClick={uploadDocument}
                  >
                    העלאת מסמך
                  </Button>
                </div>
                <div className={styles.cards}>
                  {documents.map((d, i) => (
                    <div key={d.id} style={{ "--i": i }} className={styles.docItem}>
                      <FileRow name={d.name} kind={d.kind} meta={d.meta} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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
              <Button
                variant="secondary"
                size="sm"
                iconStart={<Icon name="plus" size={13} stroke={2.6} />}
                onClick={uploadDocument}
              >
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

      {/* טוסט */}
      {toast ? (
        <div className={styles.toast} role="status">
          <Icon name="checkCircle" size={18} />
          {toast}
        </div>
      ) : null}
    </>
  );
}

export default MedicalRecordPage;
