import { useEffect, useState } from "react";
import { Topbar } from "../../components/layout";
import { Button } from "../../components/ui";
import { Icon } from "../../components/icons";
import { doctorService } from "../../services/doctorService";
import { weeklyAvailability } from "../../data/mock";
import styles from "./AvailabilityPage.module.css";

const SLOT_OPTIONS = [15, 20, 30];

/**
 * AvailabilityPage (רופא/ה) — יומן זמינות שבועי.
 *
 * ✦ מסך מלא: הפעלה/כיבוי לכל יום, עריכת שעות התחלה/סיום, בחירת משך תור,
 *   ושמירה עם מצב טעינה + טוסט. נתונים מ-mock (עותק מקומי).
 * TODO: doctorService — GET/PUT /api/doctors/me/availability (טבלת doctor_availability).
 */
export function DoctorAvailabilityPage() {
  const [schedule, setSchedule] = useState(weeklyAvailability);
  const [slot, setSlot] = useState(20);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const activeDays = schedule.filter((d) => d.active).length;

  const toggleDay = (wd) =>
    setSchedule((s) => s.map((d) => (d.weekday === wd ? { ...d, active: !d.active } : d)));
  const setTime = (wd, field, value) =>
    setSchedule((s) => s.map((d) => (d.weekday === wd ? { ...d, [field]: value } : d)));

  /** שמירה מול ה-API — PUT /doctors/me/availability. */
  const save = async () => {
    setSaving(true);
    try {
      await doctorService.saveAvailability({ days: schedule, slotMinutes: slot });
      setToast("יומן הזמינות נשמר");
    } catch (err) {
      setToast(err.message || "השמירה נכשלה — נסו שוב");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar
        title="יומן זמינות"
        actions={<span className={styles.summary}>{activeDays} ימי פעילות בשבוע</span>}
      />

      <div className={styles.body}>
        {/* משך תור */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>משך תור</div>
          <div className={styles.slotChips}>
            {SLOT_OPTIONS.map((m) => (
              <button
                key={m}
                className={`${styles.slotChip} ${slot === m ? styles.slotActive : ""}`}
                onClick={() => setSlot(m)}
              >
                {m} דק׳
              </button>
            ))}
          </div>
        </div>

        {/* ימי השבוע */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>שעות פעילות שבועיות</div>
          <div className={styles.days}>
            {schedule.map((d) => (
              <div key={d.weekday} className={`${styles.dayRow} ${d.active ? "" : styles.inactive}`}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={d.active}
                  aria-label={d.label}
                  className={`${styles.switch} ${d.active ? styles.on : ""}`}
                  onClick={() => toggleDay(d.weekday)}
                >
                  <span className={styles.knob} />
                </button>
                <span className={styles.dayName}>{d.label}</span>
                {d.active ? (
                  <div className={styles.times}>
                    <input
                      type="time"
                      className={styles.timeInput}
                      value={d.start}
                      onChange={(e) => setTime(d.weekday, "start", e.target.value)}
                    />
                    <span className={styles.dash}>–</span>
                    <input
                      type="time"
                      className={styles.timeInput}
                      value={d.end}
                      onChange={(e) => setTime(d.weekday, "end", e.target.value)}
                    />
                  </div>
                ) : (
                  <span className={styles.off}>לא פעיל</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.saveBar}>
          <Button onClick={save} disabled={saving} iconStart={saving ? null : <Icon name="check" size={16} stroke={2.6} />}>
            {saving ? <span className={styles.spinner} aria-hidden="true" /> : null}
            {saving ? "שומר…" : "שמירת יומן"}
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

export default DoctorAvailabilityPage;
