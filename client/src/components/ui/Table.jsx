import styles from "./Table.module.css";

/**
 * Table — טבלה מעוצבת בעטיפת radius עם overflow:hidden.
 * שורות זוגיות מודגשות, כותרת ברקע בהיר.
 *
 * @param {Array<string|React.ReactNode>} head - תאי הכותרת.
 * @param {Array<Array<string|React.ReactNode>>} rows - מערך שורות, כל שורה מערך תאים.
 */
export function Table({ head = [], rows = [], className = "" }) {
  return (
    <div className={`${styles.wrap} ${className}`}>
      <table className={styles.table}>
        {head.length > 0 && (
          <thead>
            <tr>
              {head.map((h, i) => (
                <th key={i} className={styles.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={styles.tr}>
              {row.map((cell, ci) => (
                <td key={ci} className={styles.td}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
