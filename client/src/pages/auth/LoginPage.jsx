import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/layout";
import { Button, Field, Input, Tabs } from "../../components/ui";
import { PATHS } from "../../lib/paths";
import { isEmail, isRequired, isStrongPassword, isValidIsraeliId, isPhone } from "../../utils/validators";
import styles from "./LoginPage.module.css";

const TABS = [
  { key: "login", label: "התחברות" },
  { key: "register", label: "הרשמה" },
];

/**
 * LoginPage (מסך 1) — התחברות והרשמה.
 *
 * ✦ שדרוגי חוויה: ולידציה בזמן אמת (utils/validators), הצג/הסתר סיסמה,
 *   מצב טעינה על השליחה, ומעבר חלק בין הטאבים.
 *
 * תצוגה בלבד: לאחר ולידציה מוצלחת מנווט לדשבורד המטופל (דמו).
 * TODO (שלב הלוגיקה): לחבר ל-authService (login/register), לשמור טוקן ב-AuthContext,
 *       ולטפל בשגיאות שרת (אימייל תפוס, סיסמה שגויה).
 */
export function LoginPage() {
  const [tab, setTab] = useState("login");
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (name) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((s) => ({ ...s, [name]: undefined }));
  };

  const switchTab = (t) => {
    setTab(t);
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (tab === "login") {
      if (!isEmail(values.email)) e.email = "כתובת דוא״ל לא תקינה";
      if (!isRequired(values.password)) e.password = "יש להזין סיסמה";
    } else {
      if (!isRequired(values.fullName)) e.fullName = "יש להזין שם מלא";
      if (!isValidIsraeliId(values.nationalId)) e.nationalId = "תעודת זהות לא תקינה";
      if (!isPhone(values.phone)) e.phone = "מספר טלפון לא תקין";
      if (!isEmail(values.email)) e.email = "כתובת דוא״ל לא תקינה";
      if (!isStrongPassword(values.password)) e.password = "לפחות 8 תווים, אות וספרה";
      if (values.password2 !== values.password) e.password2 = "הסיסמאות אינן תואמות";
      if (!values.terms) e.terms = "יש לאשר את תנאי השימוש";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    // דמו: סימולציית קריאת שרת ואז מעבר לדשבורד.
    setTimeout(() => navigate(PATHS.patientDashboard), 800);
  };

  const passwordField = (name, label, autoComplete) => (
    <Field label={label} htmlFor={name} error={errors[name]}>
      <div className={styles.passWrap}>
        <Input
          id={name}
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          ltr
          autoComplete={autoComplete}
          error={!!errors[name]}
          value={values[name] || ""}
          onChange={set(name)}
        />
        <button
          type="button"
          className={styles.passToggle}
          onClick={() => setShowPass((s) => !s)}
          aria-label={showPass ? "הסתר סיסמה" : "הצג סיסמה"}
        >
          {showPass ? "הסתר" : "הצג"}
        </button>
      </div>
    </Field>
  );

  return (
    <AuthLayout>
      <div className={styles.head}>
        <h1 className={styles.title}>{tab === "login" ? "ברוכים השבים" : "יצירת חשבון"}</h1>
        <p className={styles.subtitle}>
          {tab === "login"
            ? "התחברו כדי לנהל את התורים והתיק הרפואי"
            : "הרשמה למטופלים חדשים — מהיר ופשוט"}
        </p>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={switchTab} variant="pill" className={styles.tabs} />

      <form className={styles.form} onSubmit={handleSubmit} noValidate key={tab}>
        {tab === "login" ? (
          <>
            <Field label="דוא״ל" htmlFor="email" error={errors.email}>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                ltr
                autoComplete="email"
                error={!!errors.email}
                value={values.email || ""}
                onChange={set("email")}
              />
            </Field>
            {passwordField("password", "סיסמה", "current-password")}
            <div className={styles.row}>
              <label className={styles.check}>
                <input type="checkbox" checked={!!values.remember} onChange={set("remember")} /> זכור אותי
              </label>
              <button type="button" className={styles.link}>
                שכחת סיסמה?
              </button>
            </div>
            <Button type="submit" size="cta" block disabled={loading}>
              {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
              {loading ? "מתחבר…" : "התחברות"}
            </Button>
            <p className={styles.switch}>
              אין לך חשבון?{" "}
              <button type="button" className={styles.link} onClick={() => switchTab("register")}>
                הרשמה
              </button>
            </p>
          </>
        ) : (
          <>
            <Field label="שם מלא" htmlFor="fullName" error={errors.fullName}>
              <Input
                id="fullName"
                placeholder="ישראל ישראלי"
                autoComplete="name"
                error={!!errors.fullName}
                value={values.fullName || ""}
                onChange={set("fullName")}
              />
            </Field>
            <div className={styles.grid2}>
              <Field label="תעודת זהות" htmlFor="nid" error={errors.nationalId}>
                <Input
                  id="nid"
                  placeholder="000000000"
                  ltr
                  inputMode="numeric"
                  error={!!errors.nationalId}
                  value={values.nationalId || ""}
                  onChange={set("nationalId")}
                />
              </Field>
              <Field label="טלפון" htmlFor="phone" error={errors.phone}>
                <Input
                  id="phone"
                  placeholder="050-0000000"
                  ltr
                  inputMode="tel"
                  error={!!errors.phone}
                  value={values.phone || ""}
                  onChange={set("phone")}
                />
              </Field>
            </div>
            <Field label="דוא״ל" htmlFor="remail" error={errors.email}>
              <Input
                id="remail"
                type="email"
                placeholder="name@example.com"
                ltr
                error={!!errors.email}
                value={values.email || ""}
                onChange={set("email")}
              />
            </Field>
            <div className={styles.grid2}>
              {passwordField("password", "סיסמה", "new-password")}
              <Field label="אישור סיסמה" htmlFor="password2" error={errors.password2}>
                <Input
                  id="password2"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  ltr
                  error={!!errors.password2}
                  value={values.password2 || ""}
                  onChange={set("password2")}
                />
              </Field>
            </div>
            <label className={`${styles.check} ${errors.terms ? styles.checkError : ""}`}>
              <input type="checkbox" checked={!!values.terms} onChange={set("terms")} /> אני מאשר/ת את
              תנאי השימוש ומדיניות הפרטיות
            </label>
            <Button type="submit" size="cta" block disabled={loading}>
              {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
              {loading ? "יוצר חשבון…" : "יצירת חשבון"}
            </Button>
            <p className={styles.switch}>
              כבר רשום/ה?{" "}
              <button type="button" className={styles.link} onClick={() => switchTab("login")}>
                התחברות
              </button>
            </p>
          </>
        )}
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
