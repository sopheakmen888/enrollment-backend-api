const studentRepository = require('../repositories/student.repository');

async function getStudent(req, res, next) {
  try {
    const student = await studentRepository.getStudentWithEnrollments(Number(req.params.id));
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
}

module.exports = { getStudent };
