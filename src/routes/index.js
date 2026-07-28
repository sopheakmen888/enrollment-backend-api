const router = require('express').Router();
const courseController = require('../controllers/course.controller');
const studentController = require('../controllers/student.controller');
const enrollmentController = require('../controllers/enrollment.controller');

// S6.1 — list courses (optional ?search=)
router.get('/courses', courseController.listCourses);

// S6.2 — one student with their enrollments
router.get('/students/:id', studentController.getStudent);

// S6.3 — report: enrollments and money collected per course
router.get('/reports/course-enrollments', courseController.getEnrollmentReport);

// S7.1 — enroll a student in a course
router.post('/enrollments', enrollmentController.enrollStudent);

// S7.2 — drop an enrollment
router.put('/enrollments/:id/drop', enrollmentController.dropEnrollment);

module.exports = router;
