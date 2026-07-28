// Seed data — fixed values so grading results are always the same.
// Run with: npm run seed
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clean tables and restart ids at 1, so requests.http always
  // matches the data — even after re-seeding
  await prisma.$executeRaw`TRUNCATE "Enrollment", "Course", "Student" RESTART IDENTITY CASCADE`;

  const students = await prisma.student.createManyAndReturn({
    data: [
      { name: 'Sok Pisey', email: 'pisey@example.com', phone: '012345678' },
      { name: 'Chan Dara', email: 'dara@example.com', phone: '098765432' },
      { name: 'Kim Srey', email: 'srey@example.com', phone: null },
      { name: 'Long Vibol', email: 'vibol@example.com', phone: '011223344' },
    ],
  });

  const courses = await prisma.course.createManyAndReturn({
    data: [
      { name: 'Web Development Basics', fee: 120, seatsTotal: 20, seatsAvailable: 18 },
      { name: 'Database Fundamentals', fee: 100, seatsTotal: 15, seatsAvailable: 14 },
      { name: 'JavaScript Programming', fee: 150, seatsTotal: 12, seatsAvailable: 12 },
      { name: 'Networking Essentials', fee: 90, seatsTotal: 10, seatsAvailable: 9 },
      { name: 'UX Design Workshop', fee: 200, seatsTotal: 1, seatsAvailable: 0 },
    ],
  });

  const [pisey, dara, srey, vibol] = students;
  const [webDev, database, , networking, uxDesign] = courses;

  const day = 24 * 60 * 60 * 1000;
  const daysAgo = (n) => new Date(Date.now() - n * day);

  // Enrollments must match seatsAvailable above:
  // Web Development Basics: 2 ACTIVE (20 -> 18)
  // Database Fundamentals: 1 ACTIVE + 1 DROPPED (15 -> 14, drop freed the seat)
  // JavaScript Programming: no enrollments (12 -> 12)
  // Networking Essentials: 1 ACTIVE (10 -> 9)
  // UX Design Workshop: 1 ACTIVE (1 -> 0, course is full)
  await prisma.enrollment.createMany({
    data: [
      { studentId: pisey.id, courseId: webDev.id, status: 'ACTIVE', enrollDate: daysAgo(10) },
      { studentId: dara.id, courseId: webDev.id, status: 'ACTIVE', enrollDate: daysAgo(9) },
      { studentId: srey.id, courseId: database.id, status: 'ACTIVE', enrollDate: daysAgo(7) },
      { studentId: dara.id, courseId: database.id, status: 'DROPPED', enrollDate: daysAgo(7) },
      { studentId: vibol.id, courseId: networking.id, status: 'ACTIVE', enrollDate: daysAgo(3) },
      { studentId: pisey.id, courseId: uxDesign.id, status: 'ACTIVE', enrollDate: daysAgo(1) },
    ],
  });

  console.log('Seed done: 4 students, 5 courses, 6 enrollments');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
