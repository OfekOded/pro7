import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/layout";
import { Button, Field, Input, Tabs } from "../../components/ui";
import { PATHS } from "../../lib/paths";
import styles from "./LoginPage.module.css";

const TABS = [
  { key: "login", label: "התחברות" },
  { key: "register", label: "הרשמה" },
];

/**
 * LoginPage (מסך 1) — התחברות והרשמה.
 * תצוגה בלבד: הטפסים אינם שולחים לשרת. בשלב זה "התחברות"/"יצירת חשבון"
 * מנווטים לדשבורד המטופל כדי לאפשר התרשמות מהמערכת.
 *
 * TODO (שלב הלוגיקה): לחבר ל-services/authService (login/register),
 * לאמת קלט (utils/validators), לטפל בשגיאות, ולשמור טוקן ב-AuthContext.
 */
export function LoginPage() {
  const [tab, setTab] = useState("login");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // דמו: מעבר לדשבורד המטופל. בהמשך — קריאת API ואז ניווט לפי תפקיד.
    navigate(PATHS.patientDashboard);
  };

  return (
    <AuthLayout>
      <div className={styles.head}>
        <h1 className={styles.title}>
          {tab === "login" ? "ברוכים השבים" : "יצירת חשבון"}
        </h1>
        <p className={styles.subtitle}>
          {tab === "login"
            ? "התחברו כדי לנהל את התורים והתיק הרפואי"
            : "הרשמה למטופלים חדשים — מהיר ופשוט"}
        </p>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} variant="pill" className={styles.tabs} />

      <form className={styles.form} onSubmit={handleSubmit}>
        {tab === "login" ? (
          <>
            <Field label="דוא״ל" htmlFor="email">
              <Input id="email" type="email" placeholder="name@example.com" ltr autoComplete="email" />
            </Field>
            <Field label="סיסמה" htmlFor="password">
              <Input id="password" type="password" placeholder="••••••••" ltr />
            </Field>
            <div className={styles.row}>
              <label className={styles.check}>
                <input type="checkbox" /> זכור אותי
              </label>
              <button type="button" className={styles.link}>
                שכחת סיסמה?
              </button>
            </div>
            <Button type="submit" size="cta" block>
              התחברות
            </Button>
            <p className={styles.switch}>
              אין לך חשבון?{" "}
              <button type="button" className={styles.link} onClick={() => setTab("register")}>
                הרשמה
              </button>
            </p>
          </>
        ) : (
          <>
            <Field label="שם מלא" htmlFor="fullName">
              <Input id="fullName" placeholder="ישראל ישראלי" autoComplete="name" />
            </Field>
            <div className={styles.grid2}>
              <Field label="תעודת זהות" htmlFor="nid">
                <Input id="nid" placeholder="000000000" ltr inputMode="numeric" />
              </Field>
              <Field label="טלפון" htmlFor="phone">
                <Input id="phone" placeholder="050-0000000" ltr inputMode="tel" />
              </Field>
            </div>
            <Field label="דוא״ל" htmlFor="remail">
              <Input id="remail" type="email" placeholder="name@example.com" ltr />
            </Field>
            <div className={styles.grid2}>
              <Field label="סיסמה" htmlFor="rpass">
                <Input id="rpass" type="password" placeholder="••••••••" ltr />
              </Field>
              <Field label="אישור סיסמה" htmlFor="rpass2">
                <Input id="rpass2" type="password" placeholder="••••••••" ltr />
              </Field>
            </div>
            <label className={styles.check}>
              <input type="checkbox" /> אני מאשר/ת את תנאי השימוש ומדיניות הפרטיות
            </label>
            <Button type="submit" size="cta" block>
              יצירת חשבון
            </Button>
            <p className={styles.switch}>
              כבר רשום/ה?{" "}
              <button type="button" className={styles.link} onClick={() => setTab("login")}>
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
