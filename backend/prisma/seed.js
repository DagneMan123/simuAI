const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@simuai.com' },
    update: {},
    create: {
      email: 'admin@simuai.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('Admin user created:', admin.email);

  // Create Test Employer
  const employerPassword = await bcrypt.hash('Employer@123', 10);
  const employer = await prisma.user.upsert({
    where: { email: 'employer@simuai.com' },
    update: {},
    create: {
      email: 'employer@simuai.com',
      password: employerPassword,
      firstName: 'Test',
      lastName: 'Employer',
      role: 'EMPLOYER',
      company: 'Test Company Inc.',
      isVerified: true,
    },
  });
  console.log('✅ Employer user created:', employer.email);

  // Create Test Candidate
  const candidatePassword = await bcrypt.hash('Candidate@123', 10);
  const candidate = await prisma.user.upsert({
    where: { email: 'candidate@simuai.com' },
    update: {},
    create: {
      email: 'candidate@simuai.com',
      password: candidatePassword,
      firstName: 'Test',
      lastName: 'Candidate',
      role: 'CANDIDATE',
      isVerified: true,
    },
  });
  console.log(' Candidate user created:', candidate.email);

  console.log('\n Seeding completed!');
  console.log('\n Test Accounts Created:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' Admin Account:');
  console.log('   Email: admin@simuai.com');
  console.log('   Password: Admin@123');
  console.log('   URL: http://localhost:3000/login');
  console.log('\n Employer Account:');
  console.log('   Email: employer@simuai.com');
  console.log('   Password: Employer@123');
  console.log('\n Candidate Account:');
  console.log('   Email: candidate@simuai.com');
  console.log('   Password: Candidate@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
