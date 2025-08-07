const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

// Test data for different operations
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const updatedUser = {
  name: 'Updated Test User',
  email: 'updated@example.com'
};

const patchUser = {
  name: 'Patched User Name'
};

// Helper function to make API requests
async function makeRequest(method, url, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making ${method} request:`, error);
    return { error: error.message };
  }
}

// Test functions
async function testPOST() {
  console.log('\n=== Testing POST (Create) ===');
  
  const result = await makeRequest('POST', `${BASE_URL}/user`, testUser);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data?.data?.id) {
    console.log('✅ POST test passed - User created with ID:', result.data.data.id);
    return result.data.data.id;
  } else {
    console.log('❌ POST test failed');
    return null;
  }
}

async function testPOSTWithPopulate() {
  console.log('\n=== Testing POST with Populate ===');
  
  const result = await makeRequest('POST', `${BASE_URL}/user?populate=role`, testUser);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data?.data?.id) {
    console.log('✅ POST with populate test passed');
    return result.data.data.id;
  } else {
    console.log('❌ POST with populate test failed');
    return null;
  }
}

async function testGETById(userId) {
  console.log('\n=== Testing GET by ID ===');
  
  const result = await makeRequest('GET', `${BASE_URL}/user/${userId}`);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data?.data?.id === userId) {
    console.log('✅ GET by ID test passed');
  } else {
    console.log('❌ GET by ID test failed');
  }
}

async function testPUT(userId) {
  console.log('\n=== Testing PUT (Full Update) ===');
  
  const result = await makeRequest('PUT', `${BASE_URL}/user/${userId}`, updatedUser);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data?.data?.name === updatedUser.name) {
    console.log('✅ PUT test passed');
  } else {
    console.log('❌ PUT test failed');
  }
}

async function testPUTWithPopulate(userId) {
  console.log('\n=== Testing PUT with Populate ===');
  
  const result = await makeRequest('PUT', `${BASE_URL}/user/${userId}?populate=role`, updatedUser);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data?.data?.name === updatedUser.name) {
    console.log('✅ PUT with populate test passed');
  } else {
    console.log('❌ PUT with populate test failed');
  }
}

async function testPATCH(userId) {
  console.log('\n=== Testing PATCH (Partial Update) ===');
  
  const result = await makeRequest('PATCH', `${BASE_URL}/user/${userId}`, patchUser);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data?.data?.name === patchUser.name) {
    console.log('✅ PATCH test passed');
  } else {
    console.log('❌ PATCH test failed');
  }
}

async function testDELETE(userId) {
  console.log('\n=== Testing DELETE ===');
  
  const result = await makeRequest('DELETE', `${BASE_URL}/user/${userId}`);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.status === 200 && result.data?.message === 'Deleted successfully') {
    console.log('✅ DELETE test passed');
  } else {
    console.log('❌ DELETE test failed');
  }
}

// Error handling tests
async function testErrorHandling() {
  console.log('\n=== Testing Error Handling ===');
  
  // Test POST without required fields
  console.log('\n--- Testing POST with invalid data ---');
  const invalidPost = await makeRequest('POST', `${BASE_URL}/user`, { name: 'Only Name' });
  console.log('Invalid POST Status:', invalidPost.status);
  console.log('Invalid POST Response:', JSON.stringify(invalidPost.data, null, 2));
  
  // Test PUT without ID
  console.log('\n--- Testing PUT without ID ---');
  const putWithoutId = await makeRequest('PUT', `${BASE_URL}/user`, updatedUser);
  console.log('PUT without ID Status:', putWithoutId.status);
  console.log('PUT without ID Response:', JSON.stringify(putWithoutId.data, null, 2));
  
  // Test DELETE with non-existent ID
  console.log('\n--- Testing DELETE with non-existent ID ---');
  const deleteNonExistent = await makeRequest('DELETE', `${BASE_URL}/user/non-existent-id`);
  console.log('DELETE non-existent Status:', deleteNonExistent.status);
  console.log('DELETE non-existent Response:', JSON.stringify(deleteNonExistent.data, null, 2));
  
  // Test with invalid model
  console.log('\n--- Testing with invalid model ---');
  const invalidModel = await makeRequest('GET', `${BASE_URL}/invalidmodel`);
  console.log('Invalid model Status:', invalidModel.status);
  console.log('Invalid model Response:', JSON.stringify(invalidModel.data, null, 2));
}

// Test different models
async function testDifferentModels() {
  console.log('\n=== Testing Different Models ===');
  
  // Test Department model
  console.log('\n--- Testing Department Model ---');
  const deptData = {
    name: 'Test Department',
    description: 'A test department'
  };
  
  const createDept = await makeRequest('POST', `${BASE_URL}/department`, deptData);
  console.log('Create Department Status:', createDept.status);
  console.log('Create Department Response:', JSON.stringify(createDept.data, null, 2));
  
  if (createDept.data?.data?.id) {
    const deptId = createDept.data.data.id;
    
    // Update department
    const updateDept = await makeRequest('PUT', `${BASE_URL}/department/${deptId}`, {
      name: 'Updated Department',
      description: 'Updated description'
    });
    console.log('Update Department Status:', updateDept.status);
    
    // Delete department
    const deleteDept = await makeRequest('DELETE', `${BASE_URL}/department/${deptId}`);
    console.log('Delete Department Status:', deleteDept.status);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting CRUD Operations Tests');
  console.log('Make sure your Next.js server is running on http://localhost:3000');
  
  try {
    // Test basic CRUD operations
    const userId1 = await testPOST();
    if (userId1) {
      await testGETById(userId1);
      await testPUT(userId1);
      await testPATCH(userId1);
      await testDELETE(userId1);
    }
    
    // Test with populate parameters
    const userId2 = await testPOSTWithPopulate();
    if (userId2) {
      await testPUTWithPopulate(userId2);
      await testDELETE(userId2);
    }
    
    // Test error handling
    await testErrorHandling();
    
    // Test different models
    await testDifferentModels();
    
    console.log('\n✅ All CRUD tests completed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testPOST,
  testGETById,
  testPUT,
  testPATCH,
  testDELETE,
  testErrorHandling
};