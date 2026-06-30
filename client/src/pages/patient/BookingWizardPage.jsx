import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Topbar } from "../../components/layout";
import { Button, Textarea, Alert, Avatar, Stepper } from "../../components/ui";
import { Icon } from "../../components/icons";
import { PATHS } from "../../lib/paths";
import {
  departments,
  doctorsByDepartment,
  calendarMonth,
  timeSlots,
  SLOT_MINUTES,
} from "../../data/mock";
import styles from "./BookingWizardPage.module.css";

const STEPS = ["מחלקה", "רופא/ה", "תאריך", "שעה", "אישור"];
const CONTINUE_LABEL = [
  "המשך לבחירת רופא",
  "המשך לבחירת תאריך",
  "המשך לבחירת שעה",
  "המשך לאישור",
];
const LEADING_BLANKS = 2; // היום הראשון בחודש הדמו נופל ביום ג׳

const cx = (...a) => a.filter(Boolean).join(" ");

/**
 * BookingWizardPage (מסך 3) — אשף זימון תור ב-5 שלבים. הזרימה המרכזית.
 *
 * האינטראקטיביות כאן היא UI בלבד: ניהול state מקומי לשלב ולבחירות
 * (step / departmentId / doctorId / date / slot / reason). הנתונים מ-data/mock.
 *
 * ✦ שדרוגי חוויה: מעברי שלבים מונפשים מודעי-כיוון, ניווט מקלדת (Enter להמשך),
 *   ומסך הצלחה עם אנימציית וי. הכול מכבד prefers-reduced-motion.
 *
 * TODO (שלב הלוגיקה): כל שלב צריך למשוך מהשרת —
 *   מחלקות: GET /departments · רופאים: GET /doctors?departmentId=
 *   זמינות: GET /doctors/:id/availability?date= · שמירה: POST /appointments.
 *   יש לאמת זמינות מול double-booking לפני שמירה (ראו appointment.service).
 */
export function BookingWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [reason, setReason] = useState("");

  const department = departments.find((d) => d.id === departmentId);
  const doctorList = departmentId ? doctorsByDepartment(departmentId) : [];
  const doctor = doctorList.find((d) => d.id === doctorId);

  const pickDepartment = (id) => {
    setDepartmentId(id);
    setDoctorId(null);
    setDate(null);
    setSlot(null);
  };
  const pickDoctor = (id) => {
    setDoctorId(id);
    setDate(null);
    setSlot(null);
  };

  const canContinue = [departmentId, doctorId, date, slot, true][step];

  const next = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(4, s + 1));
  }, []);
  const back = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }, []);
  const confirm = useCallback(() => setConfirmed(true), []);

  const reset = () => {
    setConfirmed(false);
    setStep(0);
    setDirection(1);
    setDepartmentId(null);
    setDoctorId(null);
    setDate(null);
    setSlot(null);
    setReason("");
  };

  // ניווט מקלדת: Enter מקדם (אך לא בתוך textarea, ולא במסך ההצלחה)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" || confirmed) return;
      if (e.target?.tagName === "TEXTAREA") return;
      if (step < 4 && canContinue) {
        e.preventDefault();
        next();
      } else if (step === 4) {
        e.preventDefault();
        confirm();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, canContinue, confirmed, next, confirm]);

  /* ----------------------- מסך הצלחה ----------------------- */
  if (confirmed) {
    return (
      <>
        <Topbar title="זימון תור" subtitle="אישור" />
        <div className={styles.body}>
          <div className={cx(styles.card, styles.successCard)}>
            <svg className={styles.successIcon} viewBox="0 0 52 52" aria-hidden="true">
              <circle className={styles.successCircle} cx="26" cy="26" r="24" />
              <path className={styles.successCheck} d="M14 27l8 8 16-16" />
            </svg>
            <h2 className={styles.successTitle}>התור נקבע בהצלחה!</h2>
            <p className={styles.successSub}>
              {doctor?.name} · {department?.name}
              <br />
              {date} ב{calendarMonth.label} · {slot} · חדר {doctor?.room}
            </p>
            <Alert variant="success" className={styles.successAlert}>
              שלחנו אישור למייל. תישלח תזכורת יום לפני המועד.
            </Alert>
            <div className={styles.successActions}>
              <Button onClick={() => navigate(PATHS.appointments)}>לצפייה בתורים שלי</Button>
              <Button variant="outline" onClick={reset}>
                קביעת תור נוסף
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="זימון תור" subtitle="חמישה שלבים פשוטים לקביעת תור" />

      <div className={styles.body}>
        <div className={styles.card}>
          <div className={styles.stepperWrap}>
            <Stepper steps={STEPS} current={step} />
          </div>

          <div className={styles.viewport}>
            <section
              key={step}
              className={cx(styles.step, direction > 0 ? styles.enterFwd : styles.enterBack)}
            >
              {/* ---------- שלב 1: מחלקה ---------- */}
              {step === 0 && (
                <>
                  <h2 className={styles.stepTitle}>לאיזו מחלקה תרצה/י לקבוע תור?</h2>
                  <p className={styles.stepSub}>בחר/י את התחום הרפואי המתאים</p>
                  <div className={styles.deptGrid}>
                    {departments.map((d, i) => (
                      <button
                        key={d.id}
                        type="button"
                        style={{ "--i": i }}
                        className={cx(styles.deptCard, styles.pop, departmentId === d.id && styles.selected)}
                        aria-pressed={departmentId === d.id}
                        onClick={() => pickDepartment(d.id)}
                      >
                        {departmentId === d.id && (
                          <span className={styles.checkCorner}>
                            <Icon name="check" size={13} stroke={3.5} />
                          </span>
                        )}
                        <span className={styles.deptIcon}>
                          <Icon name={d.icon} size={24} />
                        </span>
                        <div className={styles.deptName}>{d.name}</div>
                        <div className={styles.deptMeta}>{d.doctorsCount} רופאים</div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* ---------- שלב 2: רופא/ה ---------- */}
              {step === 1 && (
                <>
                  <span className={styles.contextPill}>{department?.name}</span>
                  <h2 className={styles.stepTitle}>בחר/י רופא/ה</h2>
                  <div className={styles.doctorList}>
                    {doctorList.map((d, i) => (
                      <button
                        key={d.id}
                        type="button"
                        style={{ "--i": i }}
                        className={cx(styles.doctorCard, styles.pop, doctorId === d.id && styles.selected)}
                        aria-pressed={doctorId === d.id}
                        onClick={() => pickDoctor(d.id)}
                      >
                        <Avatar initial={d.initial} size={54} tone={doctorId === d.id ? "brand" : "gray"} />
                        <div className={styles.doctorInfo}>
                          <div className={styles.doctorName}>{d.name}</div>
                          <div className={styles.doctorMeta}>
                            {d.specialty} · חדר {d.room}
                          </div>
                        </div>
                        <div className={styles.doctorSide}>
                          <span
                            className={cx(
                              styles.availBadge,
                              d.availability === "free" ? styles.availFree : styles.availBusy
                            )}
                          >
                            <span className={styles.availDot} />
                            {d.availability === "free" ? "פנוי/ה השבוע" : "עומס גבוה"}
                          </span>
                          <div className={styles.nextSlot}>התור הקרוב: {d.nextSlot}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* ---------- שלב 3: תאריך ---------- */}
              {step === 2 && (
                <>
                  <h2 className={styles.stepTitle}>בחר/י תאריך לתור</h2>
                  <p className={styles.stepSub}>{doctor?.name} · ימים זמינים מסומנים</p>
                  <div className={styles.calendar}>
                    <div className={styles.calHead}>
                      <button type="button" className={styles.calNav} aria-label="חודש קודם">
                        <Icon name="chevronRight" size={16} stroke={2.4} />
                      </button>
                      <span className={styles.calMonth}>{calendarMonth.label}</span>
                      <button type="button" className={styles.calNav} aria-label="חודש הבא">
                        <Icon name="chevronLeft" size={16} stroke={2.4} />
                      </button>
                    </div>
                    <div className={styles.calWeek}>
                      {calendarMonth.weekDays.map((w) => (
                        <span key={w} className={styles.calWeekDay}>
                          {w}
                        </span>
                      ))}
                    </div>
                    <div className={styles.calGrid}>
                      {Array.from({ length: LEADING_BLANKS }).map((_, i) => (
                        <span key={`b${i}`} />
                      ))}
                      {calendarMonth.days.map((d) => {
                        const isFull = d.state === "full";
                        const isSelected = date === d.day;
                        return (
                          <button
                            key={d.day}
                            type="button"
                            disabled={isFull}
                            aria-pressed={isSelected}
                            onClick={() => setDate(d.day)}
                            className={cx(
                              styles.calDay,
                              isSelected ? styles.calSelected : isFull ? styles.calFull : styles.calFree
                            )}
                          >
                            {d.day}
                          </button>
                        );
                      })}
                    </div>
                    <div className={styles.calLegend}>
                      <span>
                        <span className={cx(styles.legendSwatch, styles.swatchFree)} />פנוי
                      </span>
                      <span>
                        <span className={cx(styles.legendSwatch, styles.swatchSelected)} />נבחר
                      </span>
                      <span>
                        <span className={cx(styles.legendSwatch, styles.swatchFull)} />מלא/סגור
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ---------- שלב 4: שעה ---------- */}
              {step === 3 && (
                <>
                  <h2 className={styles.stepTitle}>בחר/י חלון שעה פנוי</h2>
                  <p className={styles.stepSub}>
                    {doctor?.name} · {date} ב{calendarMonth.label} · משך תור {SLOT_MINUTES} דק׳
                  </p>
                  {[
                    { key: "morning", label: "בוקר", icon: "clock", list: timeSlots.morning },
                    { key: "afternoon", label: "צהריים ואחה״צ", icon: "clock", list: timeSlots.afternoon },
                  ].map((group) => (
                    <div key={group.key} className={styles.slotGroup}>
                      <div className={styles.slotGroupLabel}>
                        <Icon name={group.icon} size={15} />
                        {group.label}
                      </div>
                      <div className={styles.slotGrid}>
                        {group.list.map((s, i) => (
                          <button
                            key={s.time}
                            type="button"
                            disabled={s.taken}
                            style={{ "--i": i }}
                            aria-pressed={slot === s.time}
                            onClick={() => setSlot(s.time)}
                            className={cx(
                              styles.slot,
                              styles.pop,
                              slot === s.time ? styles.slotSelected : s.taken && styles.slotTaken
                            )}
                          >
                            {s.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* ---------- שלב 5: אישור ---------- */}
              {step === 4 && (
                <>
                  <h2 className={styles.stepTitle}>אישור פרטי התור</h2>
                  <p className={styles.stepSub}>בדוק/י שהכל נכון לפני הקביעה</p>
                  <div className={styles.summaryWrap}>
                    <div className={styles.summary}>
                      {[
                        { icon: "user", label: "רופא/ה", value: doctor?.name },
                        { icon: "calendar", label: "מחלקה", value: department?.name },
                        {
                          icon: "clock",
                          label: "מועד",
                          value: `${date} ב${calendarMonth.label} · ${slot}`,
                        },
                        { icon: "mapPin", label: "מיקום", value: `חדר ${doctor?.room}` },
                      ].map((r) => (
                        <div key={r.label} className={styles.summaryRow}>
                          <span className={styles.summaryKey}>
                            <Icon name={r.icon} size={17} />
                            {r.label}
                          </span>
                          <span className={styles.summaryVal}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                    <label className={styles.reasonLabel} htmlFor="reason">
                      סיבת הביקור (לא חובה)
                    </label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="לדוגמה: בדיקת מעקב לחץ דם…"
                      rows={3}
                    />

                    <Alert variant="info" className={styles.confirmAlert}>
                      ניתן לבטל את התור עד 24 שעות לפני המועד ללא חיוב. תישלח תזכורת יום לפני.
                    </Alert>
                  </div>
                </>
              )}
            </section>
          </div>

          {/* ---------- ניווט ---------- */}
          <div className={styles.nav}>
            <Button variant="outline" onClick={back} disabled={step === 0}>
              חזרה
            </Button>
            {step < 4 ? (
              <Button
                onClick={next}
                disabled={!canContinue}
                iconStart={<Icon name="chevronLeft" size={16} stroke={2.4} />}
              >
                {CONTINUE_LABEL[step]}
              </Button>
            ) : (
              <Button onClick={confirm} iconStart={<Icon name="check" size={18} stroke={2.6} />}>
                אישור וקביעת התור
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingWizardPage;
