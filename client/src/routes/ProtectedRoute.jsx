import { Outlet } from "react-router-dom";

/**
 * ProtectedRoute — שמירת נתיב לפי אימות והרשאת-תפקיד.
 *
 * ⚠️ STUB: בשלב זה מעביר את כל הנתיבים (אין עדיין אימות) כדי לאפשר
 *    התרשמות מהמערכת. יש לממש את ההגנה האמיתית בשלב הלוגיקה.
 *
 * TODO (שלב הלוגיקה):
 *   const { user, isLoading } = useAuth();           // context/AuthContext
 *   if (isLoading) return <Spinner/>;
 *   if (!user) return <Navigate to={PATHS.login} replace />;          // לא מחובר
 *   if (allow && !allow.includes(user.role))                          // תפקיד לא מתאים
 *     return <Navigate to={homeFor(user.role)} replace />;
 *   return <Outlet/>;
 *
 * @param {string[]} [allow] - התפקידים המורשים לנתיב (למשל [ROLES.doctor]).
 */
// eslint-disable-next-line no-unused-vars
export function ProtectedRoute({ allow }) {
  return <Outlet />;
}

export default ProtectedRoute;
