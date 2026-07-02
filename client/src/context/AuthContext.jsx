import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { getToken, setToken, clearToken } from "../services/tokenStore";

/**
 * AuthContext — מצב אימות גלובלי: משתמש מחובר + פעולות login/register/logout.
 *
 * זרימה:
 *  1. עליית אפליקציה: אם קיים טוקן (tokenStore) → GET /auth/me לאימות ולמילוי
 *     המשתמש. טוקן לא-תקין מנוקה בשקט. עד אז isLoading=true (הראוטים מחכים).
 *  2. login/register: הקריאה לשרת מחזירה { token, user }; הטוקן נשמר
 *     (sessionStorage; localStorage רק ב"זכור אותי") והמשתמש נכנס ל-state.
 *  3. logout: ניקוי מלא של הטוקן וה-state.
 *  4. 401 גלובלי: apiClient משדר "auth:unauthorized" → ניתוק אוטומטי.
 *
 * עקרונות אבטחה:
 *  - הסיסמה עוברת ישירות לקריאת השרת ולא נשמרת/נרשמת בשום מקום.
 *  - אובייקט המשתמש חי בזיכרון בלבד (לא ב-storage) — נטען מחדש מ-/auth/me.
 *  - בדיקות תפקיד בצד הלקוח הן UX בלבד; האכיפה האמיתית בשרת (requireRole).
 */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // שחזור סשן בעליית האפליקציה
  useEffect(() => {
    let active = true;
    (async () => {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: me } = await authService.me();
        if (active) setUser(me);
      } catch {
        clearToken(); // טוקן פג/לא תקין — מנקים בשקט
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  // ניתוק גלובלי כשבקשה מאומתת מקבלת 401 (טוקן פג בצד השרת)
  useEffect(() => {
    window.addEventListener("auth:unauthorized", logout);
    return () => window.removeEventListener("auth:unauthorized", logout);
  }, [logout]);

  const login = useCallback(async (credentials, { remember = false } = {}) => {
    const { token, user: loggedIn } = await authService.login(credentials);
    setToken(token, remember);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: created } = await authService.register(payload);
    setToken(token, false);
    setUser(created);
    return created;
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: !!user, login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
