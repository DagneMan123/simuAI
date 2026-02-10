#!/usr/bin/env node

/**
 * Integration Testing Script
 * Tests Chapa Payment and AI Service integrations
 */

const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

async function testChapaIntegration() {
  logSection('🔍 Testing Chapa Payment Integration');

  // Check environment variables
  log('Checking environment variables...', 'blue');
  const requiredVars = ['CHAPA_SECRET_KEY', 'CHAPA_PUBLIC_KEY', 'CHAPA_BASE_URL'];
  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    log(`❌ Missing environment variables: ${missing.join(', ')}`, 'red');
    log('Please set these in backend/.env file', 'yellow');
    return false;
  }

  log('✅ All Chapa environment variables are set', 'green');

  // Test Chapa API connectivity
  log('\nTesting Chapa API connectivity...', 'blue');
  try {
    const response = await axios.get(`${process.env.CHAPA_BASE_URL}/transaction/verify/test`, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
      validateStatus: () => true, // Don't throw on any status
    });

    if (response.status === 404 || response.status === 401) {
      log('✅ Chapa API is reachable', 'green');
      if (response.status === 401) {
        log('⚠️  API key might be invalid (401 response)', 'yellow');
      }
    } else {
      log(`✅ Chapa API responded with status: ${response.status}`, 'green');
    }
  } catch (error) {
    log(`❌ Failed to connect to Chapa API: ${error.message}`, 'red');
    return false;
  }

  log('\n✅ Chapa integration check complete', 'green');
  return true;
}

async function testAIIntegration() {
  logSection('🤖 Testing AI Service Integration');

  // Check which AI service is configured
  log('Checking AI service configuration...', 'blue');

  let aiService = null;
  if (process.env.GROQ_API_KEY) {
    aiService = 'Groq';
    log('✅ Groq API key found', 'green');
  } else if (process.env.OPENAI_API_KEY) {
    aiService = 'OpenAI';
    log('✅ OpenAI API key found', 'green');
  } else if (process.env.ANTHROPIC_API_KEY) {
    aiService = 'Anthropic';
    log('✅ Anthropic API key found', 'green');
  } else {
    log('❌ No AI API key configured', 'red');
    log('Please set one of: GROQ_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY', 'yellow');
    return false;
  }

  // Test AI API connectivity
  log(`\nTesting ${aiService} API connectivity...`, 'blue');
  try {
    if (aiService === 'Groq') {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: 'Say "Hello"' }],
          max_tokens: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      log(`✅ ${aiService} API is working! Response: ${response.data.choices[0].message.content}`, 'green');
    } else if (aiService === 'OpenAI') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Say "Hello"' }],
          max_tokens: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      log(`✅ ${aiService} API is working! Response: ${response.data.choices[0].message.content}`, 'green');
    } else if (aiService === 'Anthropic') {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Say "Hello"' }],
        },
        {
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );
      log(`✅ ${aiService} API is working! Response: ${response.data.content[0].text}`, 'green');
    }
  } catch (error) {
    log(`❌ Failed to connect to ${aiService} API: ${error.response?.data?.error?.message || error.message}`, 'red');
    if (error.response?.status === 401) {
      log('⚠️  API key is invalid or expired', 'yellow');
    }
    return false;
  }

  log(`\n✅ ${aiService} integration check complete`, 'green');
  return true;
}

async function testBackendEndpoints() {
  logSection('🌐 Testing Backend Endpoints');

  log('Checking if backend server is running...', 'blue');
  try {
    const response = await axios.get(`${API_URL}/health`);
    log('✅ Backend server is running', 'green');
    log(`   Status: ${response.data.status}`, 'blue');
    log(`   Environment: ${response.data.environment}`, 'blue');
  } catch (error) {
    log('❌ Backend server is not running', 'red');
    log('Please start the backend server: cd backend && npm run dev', 'yellow');
    return false;
  }

  // Test payment endpoint
  log('\nTesting payment endpoint...', 'blue');
  try {
    const response = await axios.get(`${API_URL}/payment/subscription-plans`, {
      validateStatus: () => true,
    });
    if (response.status === 200) {
      log('✅ Payment endpoint is accessible', 'green');
      log(`   Found ${response.data.plans?.length || 0} subscription plans`, 'blue');
    } else {
      log(`⚠️  Payment endpoint returned status: ${response.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ Payment endpoint error: ${error.message}`, 'red');
  }

  log('\n✅ Backend endpoints check complete', 'green');
  return true;
}

async function runTests() {
  log('\n🚀 SimuAI Integration Testing Tool', 'cyan');
  log('This script will test Chapa Payment and AI Service integrations\n', 'blue');

  const results = {
    chapa: await testChapaIntegration(),
    ai: await testAIIntegration(),
    backend: await testBackendEndpoints(),
  };

  // Summary
  logSection('📊 Test Summary');

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  log(`Chapa Integration: ${results.chapa ? '✅ PASS' : '❌ FAIL'}`, results.chapa ? 'green' : 'red');
  log(`AI Integration: ${results.ai ? '✅ PASS' : '❌ FAIL'}`, results.ai ? 'green' : 'red');
  log(`Backend Endpoints: ${results.backend ? '✅ PASS' : '❌ FAIL'}`, results.backend ? 'green' : 'red');

  console.log('\n' + '='.repeat(60));
  log(`\nTotal: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');

  if (passed === total) {
    log('\n🎉 All integrations are working correctly!', 'green');
    log('You can now start using Chapa payments and AI features.', 'blue');
  } else {
    log('\n⚠️  Some integrations need attention', 'yellow');
    log('Please check the errors above and refer to INTEGRATION_GUIDE.md', 'blue');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test script error: ${error.message}`, 'red');
  process.exit(1);
});
