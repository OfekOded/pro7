/**
 * auth.controller.js — מקבל את הבקשה, מאמת קלט, קורא ל-service, מחזיר תשובה.
 * הבקר "דק" — אין כאן SQL; הלוגיקה ב-services.
 *
 * ⚠️ STUB. פעולות:
 *   register(req,res): { fullName, nationalId, email, phone, password } →
 *                      authService.register → { token, user } (201)
 *   login(req,res):    { email, password } → authService.login → { token, user }
 *   me(req,res):       req.user (מ-middleware/auth) → { user }
 *
 * עוטפים כל פעולה ב-asyncHandler כדי להעביר שגיאות ל-errorHandler.
 */

// TODO: לממש register/login/me.
