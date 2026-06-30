/**
 * auth.service.js — לוגיקת אימות.
 * ⚠️ STUB. אחריות:
 *   register: לוודא שהאימייל/ת.ז פנויים → password.hash → userModel.create
 *             (role='patient') → jwt.sign → { token, user }.
 *   login:    userModel.findByEmail → password.compare → jwt.sign → { token, user }.
 *             במקרה כשל: לזרוק ApiError(401).
 *   verify:   userModel.findById(payload.sub) ל-middleware/auth.
 */

// TODO: לממש לפי utils/jwt.js + utils/password.js + models/user.model.js.
