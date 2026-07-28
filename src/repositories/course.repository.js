const prisma = require('../prisma');

// S6.1 (10 pts)
// Return all courses, ordered by id.
// If `search` is given, return only courses whose name contains it
// (case-insensitive).
async function listCourses(search) {
  return prisma.course.findMany({
    where: search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {},
    orderBy: { id: 'asc' },
  });
}

// S6.3 (15 pts) — must use raw SQL with prisma.$queryRaw
// Return one row per course: id, name, totalEnrollments, moneyCollected.
// - totalEnrollments = all enrollments ever (ACTIVE and DROPPED — the
//   fee is paid at enrollment and not refunded), 0 if none.
// - moneyCollected = totalEnrollments * fee.
// Order by totalEnrollments descending, then id ascending.
async function getEnrollmentReport() {
  return prisma.$queryRaw`
    SELECT c."id",
           c."name",
           COUNT(e."id")::int AS "totalEnrollments",
           (COUNT(e."id") * c."fee")::int AS "moneyCollected"
    FROM "Course" c
    LEFT JOIN "Enrollment" e ON e."courseId" = c."id"
    GROUP BY c."id", c."name", c."fee"
    ORDER BY "totalEnrollments" DESC, c."id" ASC
  `;
}

module.exports = { listCourses, getEnrollmentReport };
