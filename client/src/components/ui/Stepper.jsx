import { Fragment } from "react";
import { Icon } from "../icons";
import styles from "./Stepper.module.css";

/**
 * Stepper — סטפר אופקי ל-5 שלבי אשף הזימון.
 * צומת שהושלם = ירוק עם וי · נוכחי = אלמוג · עתידי = לבן/אפור.
 * הקווים המחברים נצבעים ירוק עד לשלב הנוכחי.
 *
 * @param {string[]} steps - תוויות השלבים.
 * @param {number} current - אינדקס השלב הנוכחי (מ-0).
 */
export function Stepper({ steps, current, className = "" }) {
  return (
    <div className={`${styles.stepper} ${className}`}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const state = done ? "done" : active ? "active" : "future";
        return (
          <Fragment key={i}>
            {i > 0 && (
              <span className={`${styles.line} ${i <= current ? styles.lineDone : ""}`} />
            )}
            <div className={styles.node}>
              <span className={`${styles.dot} ${styles[state]}`}>
                {done ? <Icon name="check" size={15} stroke={2.6} /> : i + 1}
              </span>
              <span className={`${styles.label} ${active ? styles.labelActive : ""}`}>
                {label}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export default Stepper;
