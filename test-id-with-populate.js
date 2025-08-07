const axios = require('axios');

// Comprehensive test for ID-based API with populate functionality
const BASE_URL = 'http://localhost:3000/api';

async function testIdWithPopulate() {
  console.log('🧪 Testing ID-based API with Populate Depth Feature\n');
  
  try {
    // Test 1: Basic ID fetch without populate
    console.log('📋 Test 1: Basic ID fetch (no populate)');
    const usersResponse = await axios.get(`${BASE_URL}/user`);
    
    if (!usersResponse.data.data || usersResponse.data.data.length === 0) {
      console.log('❌ No users found. Please ensure database has test data.');
      return;
    }
    
    const testUserId = usersResponse.data.data[0].id;
    console.log(`Using test user ID: ${testUserId}`);
    
    const basicUserResponse = await axios.get(`${BASE_URL}/user/${testUserId}`);
    console.log(`✅ Status: ${basicUserResponse.status}`);
    console.log(`✅ User: ${basicUserResponse.data.data.name}\n`);
    
    // Test 2: ID fetch with single populate
    console.log('🔗 Test 2: ID fetch with single populate (role)');
    const userWithRoleResponse = await axios.get(`${BASE_URL}/user/${testUserId}?populate=role`);
    console.log(`✅ Status: ${userWithRoleResponse.status}`);
    console.log(`✅ User: ${userWithRoleResponse.data.data.name}`);
    console.log(`✅ Role: ${userWithRoleResponse.data.data.role?.name || 'No role'}\n`);
    
    // Test 3: ID fetch with multiple populate
    console.log('🔗 Test 3: ID fetch with multiple populate (role, department)');
    const userWithMultipleResponse = await axios.get(`${BASE_URL}/user/${testUserId}?populate=role,department`);
    console.log(`✅ Status: ${userWithMultipleResponse.status}`);
    console.log(`✅ User: ${userWithMultipleResponse.data.data.name}`);
    console.log(`✅ Role: ${userWithMultipleResponse.data.data.role?.name || 'No role'}`);
    console.log(`✅ Department: ${userWithMultipleResponse.data.data.department?.name || 'No department'}\n`);
    
    // Test 4: ID fetch with depth
    console.log('🔗 Test 4: ID fetch with depth (role with depth=2)');
    const userWithDepthResponse = await axios.get(`${BASE_URL}/user/${testUserId}?populate=role&depth=2`);
    console.log(`✅ Status: ${userWithDepthResponse.status}`);
    console.log(`✅ User: ${userWithDepthResponse.data.data.name}`);
    console.log(`✅ Role data:`, JSON.stringify(userWithDepthResponse.data.data.role, null, 2));
    console.log();
    
    // Test 5: ID fetch with all relations (depth only)
    console.log('🔗 Test 5: ID fetch with all relations (depth=2)');
    const userAllRelationsResponse = await axios.get(`${BASE_URL}/user/${testUserId}?depth=2`);
    console.log(`✅ Status: ${userAllRelationsResponse.status}`);
    console.log(`✅ User with all relations:`);
    console.log(JSON.stringify(userAllRelationsResponse.data.data, null, 2));
    console.log();
    
    // Test 6: Error handling - Invalid ID
    console.log('❌ Test 6: Error handling - Invalid ID');
    try {
      await axios.get(`${BASE_URL}/user/invalid-id-12345`);
      console.log('❌ Expected error but got success');
    } catch (error) {
      console.log(`✅ Expected error status: ${error.response?.status}`);
      console.log(`✅ Error message: ${error.response?.data?.message}\n`);
    }
    
    // Test 7: Error handling - Invalid model
    console.log('❌ Test 7: Error handling - Invalid model');
    try {
      await axios.get(`${BASE_URL}/invalidmodel/123`);
      console.log('❌ Expected error but got success');
    } catch (error) {
      console.log(`✅ Expected error status: ${error.response?.status}`);
      console.log(`✅ Error message: ${error.response?.data?.message}\n`);
    }
    
    // Test 8: Compare all vs single record responses
    console.log('📊 Test 8: Compare all vs single record responses');
    const allUsersWithRoleResponse = await axios.get(`${BASE_URL}/user?populate=role`);
    const singleUserWithRoleResponse = await axios.get(`${BASE_URL}/user/${testUserId}?populate=role`);
    
    console.log(`✅ All users response type: ${Array.isArray(allUsersWithRoleResponse.data.data) ? 'Array' : 'Object'}`);
    console.log(`✅ Single user response type: ${Array.isArray(singleUserWithRoleResponse.data.data) ? 'Array' : 'Object'}`);
    console.log(`✅ All users count: ${allUsersWithRoleResponse.data.data.length}`);
    console.log(`✅ Single user ID matches: ${singleUserWithRoleResponse.data.data.id === testUserId}\n`);
    
    // Test 9: Test with different models
    console.log('🏢 Test 9: Test with different models (Department)');
    const departmentsResponse = await axios.get(`${BASE_URL}/department`);
    
    if (departmentsResponse.data.data && departmentsResponse.data.data.length > 0) {
      const testDeptId = departmentsResponse.data.data[0].id;
      console.log(`Using test department ID: ${testDeptId}`);
      
      const deptWithUsersResponse = await axios.get(`${BASE_URL}/department/${testDeptId}?populate=users&depth=2`);
      console.log(`✅ Status: ${deptWithUsersResponse.status}`);
      console.log(`✅ Department: ${deptWithUsersResponse.data.data.name}`);
      console.log(`✅ Users in department: ${deptWithUsersResponse.data.data.users?.length || 0}`);
    } else {
      console.log('⚠️ No departments found for testing');
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Performance test
async function performanceTest() {
  console.log('\n⚡ Performance Test: All vs Single Record');
  
  try {
    const usersResponse = await axios.get(`${BASE_URL}/user`);
    if (!usersResponse.data.data || usersResponse.data.data.length === 0) {
      console.log('❌ No users found for performance test');
      return;
    }
    
    const testUserId = usersResponse.data.data[0].id;
    
    // Test all users with populate
    const startAll = Date.now();
    await axios.get(`${BASE_URL}/user?populate=role,department&depth=2`);
    const timeAll = Date.now() - startAll;
    
    // Test single user with populate
    const startSingle = Date.now();
    await axios.get(`${BASE_URL}/user/${testUserId}?populate=role,department&depth=2`);
    const timeSingle = Date.now() - startSingle;
    
    console.log(`⏱️ All users with populate: ${timeAll}ms`);
    console.log(`⏱️ Single user with populate: ${timeSingle}ms`);
    console.log(`📈 Performance improvement: ${((timeAll - timeSingle) / timeAll * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Performance test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testIdWithPopulate();
  await performanceTest();
}

runAllTests();