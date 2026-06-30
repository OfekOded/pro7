import { useState } from "react";

/**
 * useForm — ניהול state בסיסי לטפסים (ערכים + שגיאות).
 * ⚠️ STUB: מימוש מינימלי. TODO: אינטגרציה עם utils/validators, מצב "touched",
 *          ו-handleSubmit שמריץ ולידציה לפני שליחה.
 *
 * @param {object} initial - ערכי התחלה.
 */
export function useForm(initial = {}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
  };

  return { values, errors, setValues, setErrors, handleChange, reset };
}

export default useForm;
