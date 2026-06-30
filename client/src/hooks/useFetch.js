import { useEffect, useState } from "react";

/**
 * useFetch — הוק גנרי לשליפת נתונים עם מצבי loading/error/data.
 *
 * ⚠️ STUB (מימוש בסיסי): מתאים להחלפת צריכת ה-mock בדפים.
 * TODO: ביטול בקשות (AbortController) בעת unmount/שינוי תלות, ו-refetch ידני.
 *
 * @param {() => Promise<any>} fetcher - פונקציה שמחזירה Promise (למשל קריאת service).
 * @param {Array} deps - תלויות שמפעילות שליפה מחדש.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    Promise.resolve()
      .then(fetcher)
      .then((res) => active && setData(res))
      .catch((e) => active && setError(e))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, isLoading };
}

export default useFetch;
