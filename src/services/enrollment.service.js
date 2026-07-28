const prisma = require('../prisma');
const httpError = require('../utils/httpError');

// S7.1 (25 pts)
// Business rules:
// - student and course must exist                -> 404 if not
// - course.seatsAvailable must be > 0            -> 409 if not
// - the student must not already have an ACTIVE
//   enrollment in this course                    -> 409 if they do
//   (a DROPPED enrollment is fine — they may enroll again)
// - create the enrollment AND decrease seatsAvailable by 1
//   in ONE transaction
async function enrollStudent(studentId, courseId) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({ where: { id: studentId } });
    if (!student) throw httpError(404, 'Student not found');

    const course = await tx.course.findUnique({ where: { id: courseId } });
    if (!course) throw httpError(404, 'Course not found');

    if (course.seatsAvailable <= 0) {
      throw httpError(409, 'Course is full');
    }

    const existing = await tx.enrollment.findFirst({
      where: { studentId, courseId, status: 'ACTIVE' },
    });
    if (existing) {
      throw httpError(409, 'Student is already enrolled in this course');
    }

    await tx.course.update({
      where: { id: courseId },
      data: { seatsAvailable: { decrement: 1 } },
    });

    return tx.enrollment.create({
      data: { studentId, courseId },
    });
  });
}

// S7.2 (10 pts)
// Business rules:
// - the enrollment must exist                    -> 404 if not
// - enrollment.status must be ACTIVE             -> 409 if not
// - set status = DROPPED
// - increase the course's seatsAvailable by 1
//   (the fee is NOT refunded)
async function dropEnrollment(enrollmentId) {
  return prisma.$transaction(async (tx) => {
    const enrollment = await tx.enrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) throw httpError(404, 'Enrollment not found');

    if (enrollment.status !== 'ACTIVE') {
      throw httpError(409, 'Enrollment is already dropped');
    }

    await tx.course.update({
      where: { id: enrollment.courseId },
      data: { seatsAvailable: { increment: 1 } },
    });

    return tx.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'DROPPED' },
    });
  });
}

module.exports = { enrollStudent, dropEnrollment };
