const axios = require('axios');

// Test script for API route with ID functionality
const BASE_URL = 'http://localhost:3000/api';

async function testApiById() {
  console.log('🧪 Testing API route with ID functionality\n');
  
  try {
    // Test 1: Get all users (no ID)
    console.log('📋 Test 1: Get all users');
    const allUsersResponse = await axios.get(`${BASE_URL}/user`);
    console.log(`Status: ${allUsersResponse.status}`);
    console.log(`Records found: ${allUsersResponse.data.data?.length || 0}`);
    
    if (allUsersResponse.data.data && allUsersResponse.data.data.length > 0) {
      const firstUserId = allUsersResponse.data.data[0].id;
      console.log(`First user ID: ${firstUserId}\n`);
      
      // Test 2: Get single user by ID
      console.log('👤 Test 2: Get single user by ID');
      const singleUserResponse = await axios.get(`${BASE_URL}/user/${firstUserId}`);
      console.log(`Status: ${singleUserResponse.status}`);
      console.log(`User found: ${singleUserResponse.data.data?.id || 'none'}`);
      console.log(`User name: ${singleUserResponse.data.data?.name || 'N/A'}\n`);
      
      // Test 3: Get user by ID with populate
      console.log('🔗 Test 3: Get user by ID with populate (role, department)');
      const populatedUserResponse = await axios.get(`${BASE_URL}/user/${firstUserId}?populate=role,department&depth=2`);
      console.log(`Status: ${populatedUserResponse.status}`);
      console.log(`User with relations:`, JSON.stringify(populatedUserResponse.data.data, null, 2));
      console.log();
    }
    
    // Test 4: Try to get non-existent user
    console.log('❌ Test 4: Get non-existent user');
    try {
      const nonExistentResponse = await axios.get(`${BASE_URL}/user/non-existent-id`);
      console.log(`Unexpected success: ${nonExistentResponse.status}`);
    } catch (error) {
      console.log(`Expected error status: ${error.response?.status}`);
      console.log(`Error message: ${error.response?.data?.message}\n`);
    }
    
    // Test 5: Test with different models
    console.log('🏢 Test 5: Test with departments');
    const departmentsResponse = await axios.get(`${BASE_URL}/department`);
    console.log(`Status: ${departmentsResponse.status}`);
    console.log(`Departments found: ${departmentsResponse.data.data?.length || 0}`);
    
    if (departmentsResponse.data.data && departmentsResponse.data.data.length > 0) {
      const firstDeptId = departmentsResponse.data.data[0].id;
      console.log(`Testing single department: ${firstDeptId}`);
      
      const singleDeptResponse = await axios.get(`${BASE_URL}/department/${firstDeptId}?populate=users`);
      console.log(`Status: ${singleDeptResponse.status}`);
      console.log(`Department: ${singleDeptResponse.data.data?.name || 'N/A'}`);
      console.log(`Users in department: ${singleDeptResponse.data.data?.users?.length || 0}\n`);
    }
    
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
testApiById();