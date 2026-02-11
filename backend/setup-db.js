const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Setting up database...\n');

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@simuai.com' },
      update: {},
      create: {
        email: 'admin@simuai.com',
        password: hashedPassword,
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
        isVerified: true,
      },
    });
    console.log('✅ Admin created:', admin.email);

    // Create Employer
    const employer = await prisma.user.upsert({
      where: { email: 'employer@simuai.com' },
      update: {},
      create: {
        email: 'employer@simuai.com',
        password: hashedPassword,
        role: 'EMPLOYER',
        firstName: 'Employer',
        lastName: 'User',
        company: 'Test Company',
        isVerified: true,
      },
    });
    console.log('✅ Employer created:', employer.email);

    // Create Candidate
    const candidate = await prisma.user.upsert({
      where: { email: 'candidate@simuai.com' },
      update: {},
      create: {
        email: 'candidate@simuai.com',
        password: hashedPassword,
        role: 'CANDIDATE',
        firstName: 'Candidate',
        lastName: 'User',
        isVerified: true,
      },
    });
    console.log('✅ Candidate created:', candidate.email);

    console.log('\n✅ Database setup complete!\n');
    console.log('Test Users:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Admin:');
    console.log('   Email: admin@simuai.com');
    console.log('   Password: password123');
    console.log('');
    console.log('2. Employer:');
    console.log('   Email: employer@simuai.com');
    console.log('   Password: password123');
    console.log('');
    console.log('3. Candidate:');
    console.log('   Email: candidate@simuai.com');
    console.log('   Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
