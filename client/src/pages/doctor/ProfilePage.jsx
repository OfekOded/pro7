import { useEffect, useState } from "react";
import { Topbar } from "../../components/layout";
import { Button, Field, Input, Textarea, Avatar } from "../../components/ui";
import { Icon } from "../../components/icons";
import { currentDoctor } from "../../data/mock";
import styles from "./ProfilePage.module.css";

/**
 * ProfilePage (רופא/ה) — פרופיל מקצועי.
 *
 * ✦ טופס נשלט לעריכת פרטים מקצועיים (התמחות, חדר, ביו) + שמירה עם מצב טעינה וטוסט.
 *   נתונים מ-mock. TODO: doctorService — GET/PUT /api/doctors/me.
 */
export function DoctorProfilePage() {
  const [values, setValues] = useState({
    fullName: currentDoctor.fullName,
    specialty: currentDoctor.specialty,
    room: currentDoctor.room,
    phone: "050-7654321",
    email: "levi@clinic.test",
    bio: "קרדיולוגית בכירה, מומחית ליתר לחץ דם ומניעת מחלות לב. 15 שנות ניסיון קליני.",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast("הפרופיל נשמר בהצלחה");
    }, 800);
  };

  return (
    <>
      <Topbar title="פרופיל" />

      <div className={styles.body}>
        {/* כרטיס זהות */}
        <div className={styles.identity}>
          <Avatar initial={currentDoctor.initial} size={64} tone="green" />
          <div>
            <div className={styles.name}>{currentDoctor.fullName}</div>
            <div className={styles.roleRow}>
              <span className={styles.roleTag}>{values.specialty}</span>
              <span className={styles.room}>
                <Icon name="mapPin" size={13} />
                חדר {values.room}
              </span>
            </div>
          </div>
        </div>

        {/* פרטים מקצועיים */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>פרטים מקצועיים</h2>
          <div className={styles.formGrid}>
            <Field label="שם מלא" htmlFor="fullName">
              <Input id="fullName" value={values.fullName} onChange={set("fullName")} />
            </Field>
            <Field label="התמחות" htmlFor="specialty">
              <Input id="specialty" value={values.specialty} onChange={set("specialty")} />
            </Field>
            <Field label="מחלקה" htmlFor="dept" hint="נקבע ע״י ההנהלה">
              <Input id="dept" value="קרדיולוגיה" disabled />
            </Field>
            <Field label="חדר" htmlFor="room">
              <Input id="room" value={values.room} onChange={set("room")} ltr />
            </Field>
            <Field label="טלפון" htmlFor="phone">
              <Input id="phone" value={values.phone} onChange={set("phone")} ltr inputMode="tel" />
            </Field>
            <Field label="דוא״ל" htmlFor="email">
              <Input id="email" type="email" value={values.email} onChange={set("email")} ltr />
            </Field>
          </div>
          <Field label="אודות" htmlFor="bio" className={styles.bioField}>
            <Textarea id="bio" rows={3} value={values.bio} onChange={set("bio")} />
          </Field>
        </div>

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

export default DoctorProfilePage;
