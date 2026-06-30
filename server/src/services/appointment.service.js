/**
 * appointment.service.js — לוגיקת תורים. כאן יושב הלב של זרימת הזימון.
 *
 * ⚠️ STUB. אחריות מרכזית:
 *   book({ patientId, doctorId, departmentId, date, time, reason }):
 *     1. לאמת שהחלון פנוי (doctor.service.getAvailableSlots) — מניעת double-booking.
 *     2. להכניס appointment בסטטוס 'scheduled' בתוך transaction.
 *     3. אם האילוץ UNIQUE(doctor,date,time) נכשל (race) → לזרוק ApiError(409).
 *   list(user, filters): סינון לפי תפקיד (מטופל רואה רק את שלו וכו').
 *   cancel(id, user): רק 'scheduled' ועד 24ש לפני; אחרת ApiError(422).
 */

// TODO: לממש.
