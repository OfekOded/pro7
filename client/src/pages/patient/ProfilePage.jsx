import { useEffect, useState } from "react";
import { Topbar } from "../../components/layout";
import { Button, Field, Input, Avatar } from "../../components/ui";
import { Icon } from "../../components/icons";
import { ROLE_LABEL } from "../../lib/roles";
import { currentPatient } from "../../data/mock";
import styles from "./ProfilePage.module.css";

const PREF_DEFS = [
  { key: "reminders", title: "תזכורות תור ב-SMS", desc: "תזכורת יום לפני כל תור" },
  { key: "emailUpdates", title: "עדכוני דוא״ל", desc: "סיכומי ביקור ותוצאות בדיקה" },
  { key: "systemAlerts", title: "התראות מערכת", desc: "עדכונים חשובים ושינויים" },
];

/**
 * ProfilePage (מטופל) — פרופיל וניהול פרטים אישיים.
 *
 * ✦ טופס נשלט לעריכת פרטים + העדפות התראות (טוגלים) + שמירה עם מצב טעינה וטוסט.
 *   נתונים מ-mock. TODO: userService — GET/PUT /api/users/me.
 */
export function PatientProfilePage() {
  const [values, setValues] = useState({
    fullName: currentPatient.fullName,
    email: currentPatient.email,
    phone: currentPatient.phone,
  });
  const [prefs, setPrefs] = useState({ reminders: true, emailUpdates: true, systemAlerts: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));
  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast("הפרטים נשמרו בהצלחה");
    }, 800);
  };

  return (
    <>
      <Topbar title="פרופיל" />

      <div className={styles.body}>
        {/* כרטיס זהות */}
        <div className={styles.identity}>
          <Avatar initial={currentPatient.initial} size={64} tone="brand" />
          <div>
            <div className={styles.name}>{currentPatient.fullName}</div>
            <div className={styles.roleRow}>
              <span className={styles.roleTag}>{ROLE_LABEL[currentPatient.role]}</span>
              <span className={styles.blood}>
                <Icon name="droplet" size={13} />
                סוג דם {currentPatient.bloodType}
              </span>
            </div>
          </div>
        </div>

        {/* פרטים אישיים */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>פרטים אישיים</h2>
          <div className={styles.formGrid}>
            <Field label="שם מלא" htmlFor="fullName">
              <Input id="fullName" value={values.fullName} onChange={set("fullName")} />
            </Field>
            <Field label="תעודת זהות" htmlFor="nid" hint="לא ניתן לעריכה">
              <Input id="nid" value={currentPatient.nationalId} ltr disabled />
            </Field>
            <Field label="דוא״ל" htmlFor="email">
              <Input id="email" type="email" value={values.email} onChange={set("email")} ltr />
            </Field>
            <Field label="טלפון" htmlFor="phone">
              <Input id="phone" value={values.phone} onChange={set("phone")} ltr inputMode="tel" />
            </Field>
          </div>
        </div>

        {/* העדפות התראות */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>העדפות התראות</h2>
          <div className={styles.prefs}>
            {PREF_DEFS.map((p) => (
              <div className={styles.prefRow} key={p.key}>
                <div>
                  <div className={styles.prefTitle}>{p.title}</div>
                  <div className={styles.prefDesc}>{p.desc}</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs[p.key]}
                  aria-label={p.title}
                  className={`${styles.switch} ${prefs[p.key] ? styles.on : ""}`}
                  onClick={() => togglePref(p.key)}
                >
                  <span className={styles.knob} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* אבטחה */}
        <div className={styles.card}>
          <div className={styles.securityRow}>
            <div>
              <h2 className={styles.cardTitle}>אבטחה</h2>
              <p className={styles.securityDesc}>מומלץ להחליף סיסמה מדי כמה חודשים.</p>
            </div>
            <Button variant="outline" size="sm" iconStart={<Icon name="lock" size={14} />}>
              שינוי סיסמה
            </Button>
          </div>
        </div>

        {/* שמירה */}
        <div className={styles.saveBar}>
          <Button onClick={save} disabled={saving} iconStart={saving ? null : <Icon name="check" size={16} stroke={2.6} />}>
            {saving ? <span className={styles.spinner} aria-hidden="true" /> : null}
            {saving ? "שומר…" : "שמירת שינויים"}
          </Button>
        </div>
      </div>

      {toast ? (
        <div className={styles.toast} role="status">
          <Icon name="checkCircle" size={18} />
          {toast}
        </div>
      ) : null}
    </>
  );
}

export default PatientProfilePage;
