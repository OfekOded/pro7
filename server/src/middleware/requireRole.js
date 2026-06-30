/**
 * middleware/requireRole.js — הרשאות לפי תפקיד (RBAC). רץ אחרי auth.
 * ⚠️ STUB. דוגמה:
 *   export const requireRole = (...roles) => (req, res, next) => {
 *     if (!req.user) return next(new ApiError(401, "נדרשת התחברות"));
 *     if (!roles.includes(req.user.role)) return next(new ApiError(403, "אין הרשאה"));
 *     next();
 *   };
 *
 * שימוש:  router.get("/users", auth, requireRole("admin"), userController.list);
 */

// TODO: לממש requireRole.
