-- ============================================================
--  מרפאה חכמה — נתוני דמו (seed)
--  הרצה אחרי schema.sql:  mysql -u root -p clinic < seed.sql
--
--  ⚠️ password_hash כאן הוא placeholder. סיסמאות אמיתיות חייבות
--     להישמר כ-bcrypt hash. מומלץ לזרוע משתמשים דרך סקריפט Node
--     שמריץ bcrypt (utils/password.js), או להחליף את ה-hash למטה
--     ב-hash אמיתי שמתאים לסיסמה ידועה לבדיקות.
-- ============================================================

USE clinic;

-- מחלקות
INSERT INTO departments (name, slug, icon, description) VALUES
  ('קרדיולוגיה',    'cardiology',  'heart',       'לב וכלי דם'),
  ('עור',           'dermatology', 'droplet',     'דרמטולוגיה'),
  ('אורתופדיה',     'orthopedics', 'activity',    'עצמות ומפרקים'),
  ('עיניים',        'ophthalmology','search',     'אופתלמולוגיה'),
  ('רפואה פנימית',  'internal',    'stethoscope', 'רפואת המשפחה'),
  ('אף-אוזן-גרון',  'ent',         'user',        'א.א.ג');

-- משתמשים (PLACEHOLDER hash — ראו הערה למעלה)
-- role: patient / receptionist / doctor / admin
INSERT INTO users (role, full_name, national_id, email, phone, password_hash) VALUES
  ('admin',      'מאיה אדמין',     '100000009', 'admin@clinic.test',  '03-0000000', '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH......................'),
  ('patient',    'ישראל ישראלי',   '200000007', 'israel@clinic.test', '050-1234567','$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH......................'),
  ('doctor',     'רונית לוי',      '300000005', 'levi@clinic.test',   '050-7654321','$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH......................'),
  ('doctor',     'משה שרון',       '300000013', 'sharon@clinic.test', '050-1112222','$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH......................'),
  ('receptionist','דנה קבלה',      '400000003', 'desk@clinic.test',   '03-1112222', '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH......................');

-- פרופילי רופאים (user_id מתייחס למשתמשים בעלי role='doctor')
INSERT INTO doctors (user_id, department_id, specialty, room, bio) VALUES
  ((SELECT id FROM users WHERE email='levi@clinic.test'),   1, 'קרדיולוגית בכירה', '204', 'מומחית ליתר לחץ דם ומניעה.'),
  ((SELECT id FROM users WHERE email='sharon@clinic.test'), 2, 'רופא עור',         '112', 'דרמטולוגיה כללית.');

-- זמינות לדוגמה לרופאה רונית לוי (ימים א׳–ה׳, 08:00–14:00, חלון 20 דק׳)
INSERT INTO doctor_availability (doctor_id, weekday, start_time, end_time, slot_minutes)
SELECT d.id, wd.weekday, '08:00:00', '14:00:00', 20
FROM doctors d
JOIN (SELECT 0 AS weekday UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) wd
WHERE d.room = '204';

-- תור לדוגמה (מטופל ישראל אצל ד״ר לוי)
INSERT INTO appointments (patient_id, doctor_id, department_id, appt_date, appt_time, status, reason, room)
VALUES (
  (SELECT id FROM users WHERE email='israel@clinic.test'),
  (SELECT id FROM doctors WHERE room='204'),
  1, '2026-07-12', '09:20:00', 'scheduled', 'בדיקת מעקב לחץ דם', '204'
);
