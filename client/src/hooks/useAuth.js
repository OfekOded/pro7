import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * useAuth — גישה נוחה ל-AuthContext.
 * ⚠️ STUB: יעבוד לאחר עטיפת האפליקציה ב-<AuthProvider> (ראו AuthContext.jsx).
 *
 * שימוש: const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth חייב לרוץ בתוך <AuthProvider>");
  }
  return ctx;
}

export default useAuth;
