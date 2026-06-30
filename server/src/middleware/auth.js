/**
 * middleware/auth.js — אימות JWT וצירוף המשתמש לבקשה.
 * ⚠️ STUB. דוגמה:
 *   export function auth(req, res, next) {
 *     const header = req.headers.authorization || "";
 *     const token = header.startsWith("Bearer ") ? header.slice(7) : null;
 *     if (!token) return next(new ApiError(401, "נדרשת התחברות"));
 *     try {
 *       const payload = jwt.verify(token);        // utils/jwt
 *       req.user = { id: payload.sub, role: payload.role };
 *       next();
 *     } catch {
 *       next(new ApiError(401, "טוקן לא תקין"));
 *     }
 *   }
 */

// TODO: לממש auth.
