/**
 * user.routes.js — ניהול משתמשים.
 *
 * ⚠️ STUB. נתיבים:
 *   GET    /api/users         → userController.list      (auth + requireRole('admin'))
 *   GET    /api/users/me      → userController.me        (auth)
 *   PUT    /api/users/me      → userController.updateMe  (auth)
 *   GET    /api/users/:id     → userController.get       (auth + admin)
 *   PUT    /api/users/:id     → userController.update    (auth + admin)
 *   PATCH  /api/users/:id     → userController.setStatus (auth + admin; השבתה/הפעלה)
 *   DELETE /api/users/:id     → userController.remove    (auth + admin)
 *
 * 🔒 כלל חובה (ממומש כבר ב-mock של הלקוח — לשמר כאן): אסור למנהל/ת להשבית
 *    או למחוק את החשבון של עצמו/ה (req.user.id === :id → 422) — מניעת נעילה-עצמית.
 *    מומלץ גם לחסום השבתת ה-admin האחרון במערכת.
 */

// TODO: לממש את הנתיבים למעלה.
