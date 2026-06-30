import styles from "./Button.module.css";

/**
 * Button — כפתור המערכת. ראו מקטע "כפתורים" ב-design_handoff_clinic_ui/README.md.
 *
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [variant='primary']
 * @param {'sm'|'md'|'cta'} [size='md']
 * @param {boolean} [block] - רוחב מלא.
 * @param {React.ReactNode} [iconStart] - אייקון לפני הטקסט (בצד ההתחלה ב-RTL).
 */
export function Button({
  variant = "primary",
  size = "md",
  block = false,
  iconStart,
  className = "",
  type = "button",
  children,
  ...rest
}) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    block ? styles.block : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={cls} {...rest}>
      {iconStart ? <span className={styles.icon}>{iconStart}</span> : null}
      {children}
    </button>
  );
}

export default Button;
