-- ============================================================
--  מרפאה חכמה — סכמת בסיס הנתונים (MySQL)
--  פרויקט גמר Full-Stack · המרכז האקדמי לב
--
--  הרצה:  mysql -u root -p < schema.sql
--  או דרך כלי GUI (Workbench / DBeaver).
--
--  הערה: זוהי סכמה מוצעת ומלאה הנגזרת מהאפיון והעיצוב. ניתן לחדד
--  שדות/אינדקסים לפי הצורך בשלב פיתוח השרת.
-- ============================================================

CREATE DATABASE IF NOT EXISTS clinic
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clinic;

-- כדי לאפשר הרצה חוזרת נקייה (פיתוח בלבד) — מוחק בסדר הפוך לתלויות:
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS visits;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS doctor_availability;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

-- ------------------------------------------------------------
-- משתמשים — 4 תפקידים. סיסמאות נשמרות כ-hash (bcrypt) בלבד.
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role          ENUM('patient','receptionist','doctor','admin') NOT NULL DEFAULT 'patient',
  full_name     VARCHAR(120) NOT NULL,
  national_id   VARCHAR(9)   NOT NULL UNIQUE,
  email         VARCHAR(160) NOT NULL UNIQUE,
  phone         VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- מחלקות רפואיות
-- ------------------------------------------------------------
CREATE TABLE departments (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  slug        VARCHAR(80)  NOT NULL UNIQUE,
  icon        VARCHAR(40),                       -- מפתח אייקון (תואם ל-client icons)
  description VARCHAR(255)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- רופאים — פרופיל המרחיב משתמש בעל role='doctor'
-- ------------------------------------------------------------
CREATE TABLE doctors (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL UNIQUE,
  department_id INT UNSIGNED NOT NULL,
  specialty     VARCHAR(120),
  room          VARCHAR(20),
  bio           TEXT,
  active        TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_doctors_user       FOREIGN KEY (user_id)       REFERENCES users(id)       ON DELETE CASCADE,
  CONSTRAINT fk_doctors_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  INDEX idx_doctors_department (department_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- זמינות רופא/ה — חלונות שבועיים חוזרים (לחישוב שעות פנויות)
-- weekday: 0=ראשון ... 6=שבת
-- ------------------------------------------------------------
CREATE TABLE doctor_availability (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  doctor_id    INT UNSIGNED NOT NULL,
  weekday      TINYINT NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  slot_minutes INT  NOT NULL DEFAULT 20,
  CONSTRAINT fk_avail_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_avail_doctor (doctor_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- תורים — האילוץ UNIQUE מונע double-booking (אותו רופא/תאריך/שעה)
-- ------------------------------------------------------------
CREATE TABLE appointments (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id    INT UNSIGNED NOT NULL,
  doctor_id     INT UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  appt_date     DATE NOT NULL,
  appt_time     TIME NOT NULL,
  status        ENUM('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
  reason        TEXT,
  room          VARCHAR(20),
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_patient    FOREIGN KEY (patient_id)    REFERENCES users(id)       ON DELETE CASCADE,
  CONSTRAINT fk_appt_doctor     FOREIGN KEY (doctor_id)     REFERENCES doctors(id)     ON DELETE CASCADE,
  CONSTRAINT fk_appt_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  CONSTRAINT uq_doctor_slot UNIQUE (doctor_id, appt_date, appt_time),
  INDEX idx_appt_patient (patient_id),
  INDEX idx_appt_status (status),
  INDEX idx_appt_date (appt_date)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- ביקורים — נוצרים בסגירת ביקור ע״י הרופא/ה
-- ------------------------------------------------------------
CREATE TABLE visits (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT UNSIGNED NOT NULL UNIQUE,
  doctor_id      INT UNSIGNED NOT NULL,
  patient_id     INT UNSIGNED NOT NULL,
  diagnosis      VARCHAR(255),
  summary        TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_visit_appt    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  CONSTRAINT fk_visit_doctor  FOREIGN KEY (doctor_id)      REFERENCES doctors(id)      ON DELETE CASCADE,
  CONSTRAINT fk_visit_patient FOREIGN KEY (patient_id)     REFERENCES users(id)        ON DELETE CASCADE,
  INDEX idx_visit_patient (patient_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- מרשמים — מקושרים לביקור
-- ------------------------------------------------------------
CREATE TABLE prescriptions (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  visit_id     INT UNSIGNED NOT NULL,
  patient_id   INT UNSIGNED NOT NULL,
  medication   VARCHAR(160) NOT NULL,
  dosage       VARCHAR(160),
  instructions VARCHAR(255),
  active       TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rx_visit   FOREIGN KEY (visit_id)   REFERENCES visits(id) ON DELETE CASCADE,
  CONSTRAINT fk_rx_patient FOREIGN KEY (patient_id) REFERENCES users(id)  ON DELETE CASCADE,
  INDEX idx_rx_patient (patient_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- מסמכים — קבצי מדיה שהועלו (העלאה דרך multer; הקובץ נשמר בדיסק/אחסון,
-- בטבלה נשמר נתיב/מטא בלבד).
-- ------------------------------------------------------------
CREATE TABLE documents (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id  INT UNSIGNED NOT NULL,
  visit_id    INT UNSIGNED NULL,
  uploaded_by INT UNSIGNED NOT NULL,
  file_name   VARCHAR(255) NOT NULL,
  file_path   VARCHAR(512) NOT NULL,
  mime_type   VARCHAR(100),
  size_bytes  INT UNSIGNED,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_doc_patient  FOREIGN KEY (patient_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_doc_visit    FOREIGN KEY (visit_id)    REFERENCES visits(id) ON DELETE SET NULL,
  CONSTRAINT fk_doc_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id)  ON DELETE CASCADE,
  INDEX idx_doc_patient (patient_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- התראות (רשות) — לתזכורות תורים / עדכוני זמן-אמת
-- ------------------------------------------------------------
CREATE TABLE notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  type       VARCHAR(40),
  message    VARCHAR(255) NOT NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user (user_id, is_read)
) ENGINE=InnoDB;
