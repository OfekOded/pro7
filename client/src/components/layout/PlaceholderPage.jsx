import { Topbar } from "./Topbar";
import { EmptyState } from "../ui/EmptyState";
import styles from "./PlaceholderPage.module.css";

/**
 * PlaceholderPage — דף "בהמשך" מעוצב לפריטי ניווט שאינם בין 8 המוקאפים
 * (פרופיל, המטופלים שלי, יומן זמינות, משתמשים, רופאים, מחלקות).
 * נותן שלד מעוצב + הסבר; הלוגיקה והתוכן יתווספו בשלב הבא.
 */
export function PlaceholderPage({ title, icon = "grid", heading, description }) {
  return (
    <>
      <Topbar title={title} />
      <div className={styles.body}>
        <EmptyState
          icon={icon}
          title={heading || title}
          description={
            description ||
            "המסך הזה מתוכנן אך טרם מומש. הוא יחובר לנתונים אמיתיים בשלב פיתוח הלוגיקה."
          }
        />
      </div>
    </>
  );
}

export default PlaceholderPage;
