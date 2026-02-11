// Test authentication endpoints
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testRegister() {
  console.log('\n🧪 Testing Registration...');
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'CANDIDATE'
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Registration failed!');
    console.log('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testLogin(email, password) {
  console.log('\n🧪 Testing Login...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Error:', error.response?.data || error.message);
    return null;
  }
}

async function runTests() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║              SimuAI - Auth Endpoint Tests                        ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  
  // Test registration
  const registerResult = await testRegister();
  
  if (registerResult && registerResult.user) {
    // Test login with registered user
    await testLogin(registerResult.user.email, 'password123');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('✅ Tests complete!');
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

// Run tests
runTests().catch(console.error);
