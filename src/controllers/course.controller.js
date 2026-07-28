const courseRepository = require('../repositories/course.repository');

async function listCourses(req, res, next) {
  try {
    const courses = await courseRepository.listCourses(req.query.search);
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

async function getEnrollmentReport(req, res, next) {
  try {
    const report = await courseRepository.getEnrollmentReport();
    res.json(report);
  } catch (err) {
    next(err);
  }
}

module.exports = { listCourses, getEnrollmentReport };
