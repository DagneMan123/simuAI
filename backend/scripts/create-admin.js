const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('🔧 SimuAI Admin Creation Tool');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const email = await question('👤 Admin Email: ');
    const password = await question('Admin Password (min 8 chars): ');
    const firstName = await question(' First Name: ');
    const lastName = await question(' Last Name: ');

    console.log('\n🔄 Creating admin user...');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('⚠️  User with this email already exists!');
      const update = await question('🔄 Update existing user to admin? (y/n): ');
      
      if (update.toLowerCase() === 'y' || update.toLowerCase() === 'yes') {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: {
            role: 'ADMIN',
            firstName,
            lastName,
            isVerified: true,
          },
        });
        
        console.log('\n✅ User updated to admin successfully!');
        console.log('📧 Email:', updatedUser.email);
        console.log('👤 Name:', `${updatedUser.firstName} ${updatedUser.lastName}`);
        console.log('🎭 Role:', updatedUser.role);
      } else {
        console.log('❌ Admin creation cancelled.');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'ADMIN',
          isVerified: true,
        },
      });
      
      console.log('\n✅ Admin created successfully!');
      console.log('📧 Email:', admin.email);
      console.log('👤 Name:', `${admin.firstName} ${admin.lastName}`);
      console.log('🎭 Role:', admin.role);
      console.log('🔗 Login URL: http://localhost:3000/login');
    }

    console.log('\n🎉 Admin setup completed!');
    
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', async () => {
  console.log('\n\n👋 Goodbye!');
  rl.close();
  await prisma.$disconnect();
  process.exit(0);
});

createAdmin();