import { createContext, useState } from "react";

/**
 * AuthContext — מצב אימות גלובלי (משתמש מחובר + טוקן + פעולות).
 *
 * ⚠️ STUB: השלד מוגדר אך לא מחובר עדיין. בשלב הלוגיקה:
 *   1. לעטוף את <App/> ב-<AuthProvider> ב-main.jsx.
 *   2. login(): authService.login → לשמור token+user (localStorage + state).
 *   3. בטעינה: אם יש token → authService.me() לאימות ומילוי user.
 *   4. ProtectedRoute ו-AppShell יצרכו את user מכאן (במקום data/mock).
 *   5. apiClient.getToken() יקרא את הטוקן מכאן.
 */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoading] = useState(false);

  // TODO: לממש מול authService ולנהל token+user; כרגע placeholders.
  const login = async (_credentials) => {
    throw new Error("AuthContext.login טרם מומש — ראו ה-TODO בקובץ");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = { user, token, isLoading, isAuthenticated: !!user, login, logout, setUser, setToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
