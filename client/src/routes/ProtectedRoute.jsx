import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PageLoader } from "../components/ui";
import { PATHS } from "../lib/paths";
import { homeFor } from "../lib/roles";

/**
 * ProtectedRoute — שמירת נתיב לפי אימות והרשאת-תפקיד.
 *
 *  - בזמן שחזור הסשן (isLoading) — מציגים PageLoader ולא מסך ריק/הבהוב.
 *  - לא מחובר → הפניה ל-/login עם שמירת היעד המקורי (state.from),
 *    כדי שאחרי התחברות נחזור בדיוק לאן שהמשתמש רצה.
 *  - מחובר אך בתפקיד לא-מורשה → הפניה לדף הבית של התפקיד שלו.
 *
 * ⚠️ אבטחה: הבדיקה כאן היא שכבת UX בלבד. האכיפה האמיתית של הרשאות חייבת
 *    להתבצע בשרת (middleware auth + requireRole) על כל endpoint.
 *
 * @param {string[]} [allow] - התפקידים המורשים לנתיב (למשל [ROLES.doctor]).
 */
export function ProtectedRoute({ allow }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader label="מאמת התחברות…" />;

  if (!user) {
    return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
