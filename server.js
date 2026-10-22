
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'charan@123',
  database: process.env.DB_NAME || 'charan_course_registration',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check server and database connection
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT VERSION() AS mysqlVersion'
    );

    res.json({
      ok: true,
      mysqlVersion: rows[0].mysqlVersion
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

// Dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [[students]] = await pool.query(
      'SELECT COUNT(*) AS total FROM students'
    );

    const [[courses]] = await pool.query(
      'SELECT COUNT(*) AS total FROM courses'
    );

    const [[registrations]] = await pool.query(
      'SELECT COUNT(*) AS total FROM registrations'
    );

    res.json({
      students: students.total,
      courses: courses.total,
      registrations: registrations.total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= STUDENTS =================

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM students ORDER BY id DESC'
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add student
app.post('/api/students', async (req, res) => {
  const { full_name, email, phone } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({
      error: 'Name and email are required.'
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO students (full_name, email, phone)
       VALUES (?, ?, ?)`,
      [
        full_name.trim(),
        email.trim(),
        phone || null
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Student added successfully.'
    });
  } catch (error) {
    res.status(400).json({
      error: error.code === 'ER_DUP_ENTRY'
        ? 'That email is already registered.'
        : error.message
    });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  const { full_name, email, phone } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({
      error: 'Name and email are required.'
    });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE students
       SET full_name = ?, email = ?, phone = ?
       WHERE id = ?`,
      [
        full_name.trim(),
        email.trim(),
        phone || null,
        req.params.id
      ]
    );

    res.json({ updated: result.affectedRows });
  } catch (error) {
    res.status(400).json({
      error: error.code === 'ER_DUP_ENTRY'
        ? 'That email is already registered.'
        : error.message
    });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM students WHERE id = ?',
      [req.params.id]
    );

    res.json({ deleted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= COURSES =================

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM courses ORDER BY id DESC'
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add course
app.post('/api/courses', async (req, res) => {
  const { course_name, course_code, duration, fee } = req.body;

  if (
    !course_name ||
    !course_code ||
    !duration ||
    fee === undefined ||
    fee === ''
  ) {
    return res.status(400).json({
      error: 'Fill all course fields.'
    });
  }

  if (!Number.isFinite(Number(fee)) || Number(fee) < 0) {
    return res.status(400).json({
      error: 'Course fee must be a valid non-negative number.'
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO courses
       (course_name, course_code, duration, fee)
       VALUES (?, ?, ?, ?)`,
      [
        course_name.trim(),
        course_code.trim(),
        duration.trim(),
        Number(fee)
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Course added successfully.'
    });
  } catch (error) {
    res.status(400).json({
      error: error.code === 'ER_DUP_ENTRY'
        ? 'That course code already exists.'
        : error.message
    });
  }
});

// Update course
app.put('/api/courses/:id', async (req, res) => {
  const { course_name, course_code, duration, fee } = req.body;

  if (
    !course_name ||
    !course_code ||
    !duration ||
    fee === undefined ||
    fee === ''
  ) {
    return res.status(400).json({
      error: 'Fill all course fields.'
    });
  }

  if (!Number.isFinite(Number(fee)) || Number(fee) < 0) {
    return res.status(400).json({
      error: 'Course fee must be a valid non-negative number.'
    });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE courses
       SET course_name = ?, course_code = ?,
           duration = ?, fee = ?
       WHERE id = ?`,
      [
        course_name.trim(),
        course_code.trim(),
        duration.trim(),
        Number(fee),
        req.params.id
      ]
    );

    res.json({ updated: result.affectedRows });
  } catch (error) {
    res.status(400).json({
      error: error.code === 'ER_DUP_ENTRY'
        ? 'That course code already exists.'
        : error.message
    });
  }
});

// Delete course
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM courses WHERE id = ?',
      [req.params.id]
    );

    res.json({ deleted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= REGISTRATIONS =================

// Get registrations - FIXED DATE COLUMN
app.get('/api/registrations', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.id,
        r.registration_date,
        s.full_name,
        s.email,
        c.course_name,
        c.course_code
      FROM registrations AS r
      JOIN students AS s
        ON s.id = r.student_id
      JOIN courses AS c
        ON c.id = r.course_id
      ORDER BY r.id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Get registrations error:', error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

// Register student for a course
app.post('/api/registrations', async (req, res) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({
      error: 'Choose a student and a course.'
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO registrations (student_id, course_id)
       VALUES (?, ?)`,
      [student_id, course_id]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Registration completed successfully.'
    });
  } catch (error) {
    res.status(400).json({
      error: error.code === 'ER_DUP_ENTRY'
        ? 'This student is already registered for that course.'
        : error.message
    });
  }
});

// Delete registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM registrations WHERE id = ?',
      [req.params.id]
    );

    res.json({ deleted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'public', 'index.html')
  );
});

// Start server
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(
    `CHARAN Course Registration running at http://localhost:${port}`
  );
});
