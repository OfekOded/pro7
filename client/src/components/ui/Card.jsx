import styles from "./Card.module.css";

/**
 * Card — משטח לבן עם גבול, רדיוס וצל. אבן הבניין הבסיסית של המסכים.
 *
 * @param {'sm'|'md'|'lg'|'none'} [pad='md'] - ריפוד פנימי.
 * @param {boolean} [flush] - ללא ריפוד (לרשימות/טבלאות שממלאות את הכרטיס).
 * @param {'sm'|'lg'} [radius='lg']
 */
export function Card({
  pad = "md",
  flush = false,
  radius = "lg",
  className = "",
  as: Tag = "div",
  children,
  ...rest
}) {
  const cls = [
    styles.card,
    styles[`r-${radius}`],
    flush ? styles.flush : styles[`pad-${pad}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}

export default Card;
