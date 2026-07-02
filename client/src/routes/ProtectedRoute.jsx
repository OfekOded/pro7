import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, EmptyState, PageLoader } from "../components/ui";
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
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader label="מאמת התחברות…" />;

  if (!user) {
    return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  }

  if (allow && !allow.includes(user.role)) {
    const home = homeFor(user.role);
    // הגנה מלולאת-הפניות: אם "דף הבית" של התפקיד הוא הנתיב שנחסם
    // (תפקיד ללא מסכים משלו, למשל receptionist) — מציגים מסך ולא מפנים שוב.
    if (home === location.pathname) {
      return (
        <EmptyState
          icon="lock"
          title="אין לתפקיד שלך גישה למסך הזה"
          description="המסכים עבור התפקיד הזה טרם מומשו במערכת. ניתן להתנתק ולהתחבר בחשבון אחר."
          action={<Button onClick={logout}>התנתקות</Button>}
        />
      );
    }
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
