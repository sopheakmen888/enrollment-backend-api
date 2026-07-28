const prisma = require('../prisma');

// S6.2 (10 pts)
// Return one student by id, including their enrollments, and for each
// enrollment include the course. Return null if the student does not
// exist.
async function getStudentWithEnrollments(id) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: { course: true },
        orderBy: { id: 'asc' },
      },
    },
  });
}

module.exports = { getStudentWithEnrollments };
