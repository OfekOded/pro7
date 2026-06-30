import styles from "./Avatar.module.css";

/**
 * Avatar — ראשי-תיבות על רקע גרדיאנט מותג (או אפור). אין תמונות חיצוניות
 * במערכת — בהתאם להנדאוף.
 *
 * @param {string} initial - אות/ות ראשונה.
 * @param {number} [size=36]
 * @param {'brand'|'green'|'gray'} [tone='brand']
 */
export function Avatar({ initial, size = 36, tone = "brand", className = "" }) {
  return (
    <span
      className={`${styles.avatar} ${styles[tone]} ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export default Avatar;
