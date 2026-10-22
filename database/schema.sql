CREATE DATABASE IF NOT EXISTS charan_course_registration
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charan_course_registration;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(150) NOT NULL,
  course_code VARCHAR(30) NOT NULL UNIQUE,
  duration VARCHAR(60) NOT NULL,
  fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  registered_on DATE NOT NULL DEFAULT (CURRENT_DATE),
  UNIQUE KEY unique_student_course (student_id, course_id),
  CONSTRAINT fk_reg_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

INSERT IGNORE INTO courses (course_name, course_code, duration, fee) VALUES
('Full Stack Web Development','FSWD01','6 Months',18000),
('Python Programming','PY01','3 Months',8500),
('Java Programming','JAVA01','4 Months',12000),
('Data Analytics','DA01','4 Months',14000);
