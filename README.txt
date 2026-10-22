CHARAN STUDENT COURSE REGISTRATION SYSTEM
=========================================
6 website pages:
1. Home             index.html
2. Students         students.html
3. Courses          courses.html
4. Add New Course   add-course.html
5. Registrations    registrations.html
6. About            about.html
7. Contact          contact.html

Note: The navigation contains 6 main menu destinations plus a separate Add New Course page. The site uses shared colorful CSS, JavaScript, Node.js/Express, and MySQL 8.

REQUIREMENTS
- Node.js 18 or newer
- MySQL Server 8
- MySQL username/password

SETUP ON WINDOWS
1. Extract this ZIP to a folder, e.g. C:\CHARAN_Colorful_Course_Registration
2. Open CMD and move into that folder:
   cd C:\CHARAN_Colorful_Course_Registration

3. Create tables by running the included SQL file:
   mysql -u root -p < database\schema.sql
   Enter your MySQL password when prompted.
   This SQL creates the database charan_course_registration and tables.

   If CMD says mysql is not recognized, run this from the MySQL Server bin folder:
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   mysql -u root -p < "C:\CHARAN_Colorful_Course_Registration\database\schema.sql"
   (Change the project folder path if you extracted it somewhere else.)

4. Create your local .env file:
   Copy .env.example .env
   Open .env in Notepad and set DB_PASSWORD to your real MySQL password.
   Example:
   DB_USER=root
   DB_PASSWORD=your_actual_password
   DB_NAME=charan_course_registration

5. Install Node dependencies:
   npm install

6. Start website:
   npm start

7. Open in browser:
   http://localhost:3000

TEST DATABASE
- Visit http://localhost:3000/api/health
- It should return ok:true and your MySQL version.

FEATURES
- Students: add, edit, delete, search.
- Courses: view, add, edit, delete.
- Registrations: choose student and course from dropdowns; duplicate registrations are blocked.
- Responsive design with colorful home page and dropdown navigation.

IMPORTANT
- This ZIP contains project source code, not a pre-configured local database or node_modules.
- Update .env with your own MySQL password; do not share your password.
- Contact page message form is a front-end demo and does not send email.
