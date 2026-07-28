const enrollmentService = require('../services/enrollment.service');

async function enrollStudent(req, res, next) {
  try {
    const { studentId, courseId } = req.body;
    const enrollment = await enrollmentService.enrollStudent(Number(studentId), Number(courseId));
    res.status(201).json(enrollment);
  } catch (err) {
    next(err);
  }
}

async function dropEnrollment(req, res, next) {
  try {
    const enrollment = await enrollmentService.dropEnrollment(Number(req.params.id));
    res.json(enrollment);
  } catch (err) {
    next(err);
  }
}

module.exports = { enrollStudent, dropEnrollment };
