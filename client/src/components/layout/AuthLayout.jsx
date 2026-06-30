import { Icon } from "../icons";
import styles from "./AuthLayout.module.css";

const BENEFITS = [
  "זימון תורים מקוון בכמה קליקים",
  "תיק רפואי מרוכז ונגיש בכל זמן",
  "תזכורות ועדכונים בזמן אמת",
];

/**
 * AuthLayout — מעטפת מסכי האימות: כרטיס מפוצל עם פאנל מיתוג (גרדיאנט) וטופס.
 * הטופס מועבר כ-children. במובייל הפאנל מתקפל ללוגו ממורכז מעל הטופס.
 */
export function AuthLayout({ children }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* פאנל מיתוג */}
        <div className={styles.brandPanel}>
          <div className={styles.brandTop}>
            <span className={styles.logo}>
              <Icon name="plus" size={26} stroke={2.4} />
            </span>
            <div>
              <div className={styles.brandName}>מרפאה חכמה</div>
              <div className={styles.tagline}>ניהול מרפאה וזימון תורים</div>
            </div>
          </div>

          <ul className={styles.benefits}>
            {BENEFITS.map((b, i) => (
              <li key={i} className={styles.benefit}>
                <span className={styles.benefitDot}>
                  <Icon name="check" size={14} stroke={2.6} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className={styles.brandFoot}>© המרכז האקדמי לב · פרויקט גמר</div>
        </div>

        {/* לוגו קומפקטי למובייל */}
        <div className={styles.mobileLogo}>
          <span className={styles.logo}>
            <Icon name="plus" size={22} stroke={2.4} />
          </span>
          <span className={styles.brandName}>מרפאה חכמה</span>
        </div>

        {/* פאנל הטופס */}
        <div className={styles.formPanel}>{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
