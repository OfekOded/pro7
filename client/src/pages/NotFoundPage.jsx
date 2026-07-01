import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import { Icon } from "../components/icons";
import { PATHS } from "../lib/paths";
import styles from "./NotFoundPage.module.css";

/**
 * NotFoundPage — מסך 404 מעוצב לכל נתיב לא קיים.
 * מחליף את ה-redirect הקודם ומספק דרך חזרה ברורה.
 */
export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.logo}>
          <Icon name="plus" size={26} stroke={2.4} />
        </span>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>הדף לא נמצא</h1>
        <p className={styles.text}>
          הכתובת שחיפשת לא קיימת או הועברה. אפשר לחזור לנקודת הכניסה ולהמשיך משם.
        </p>
        <div className={styles.actions}>
          <Link to={PATHS.login}>
            <Button iconStart={<Icon name="arrowRight" size={16} />}>חזרה לכניסה</Button>
          </Link>
          <Link to={PATHS.patientDashboard}>
            <Button variant="outline">לדף הבית</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
