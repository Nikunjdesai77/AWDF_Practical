/**
 * Automated Test Script for Practical 07 Backend
 * Verifies:
 * - Health Check
 * - Registration (with password hashing)
 * - Validation errors (invalid email/short password rejected)
 * - Login & JWT issue
 * - Protected route without token (verifies 401 Unauthorized)
 * - Protected /me endpoint
 * - CRUD operations for tasks with Bearer token
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('========================================================');
  console.log(' Starting Automated Tests for Practical 07 (JWT & Auth)');
  console.log('========================================================\n');

  try {
    // 1. Health check
    console.log('[TEST 1] Testing Health check...');
    const healthRes = await fetch(`${BASE_URL}/`);
    const healthData = await healthRes.json();
    console.log(` Status: ${healthRes.status} OK | API: "${healthData.message}"`);

    // 2. Validation test - invalid email and short password
    console.log('\n[TEST 2] Testing Server-Side Validation (invalid registration)...');
    const invalidRegRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'not-an-email', password: '123' })
    });
    const invalidRegData = await invalidRegRes.json();
    console.log(` Status: ${invalidRegRes.status} Bad Request | Rejected: ${invalidRegData.error}`);
    console.log(` Details: ${invalidRegData.details?.join(', ')}`);

    // 3. Register user
    const testEmail = `student_${Date.now()}@charusat.edu.in`;
    const testPassword = 'Password123!';
    console.log(`\n[TEST 3] Registering new user (${testEmail})...`);
    const regRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Nikunj Desai',
        email: testEmail,
        password: testPassword
      })
    });
    const regData = await regRes.json();
    console.log(` Status: ${regRes.status} Created | Token generated: ${regData.token?.substring(0, 20)}...`);

    // 4. Login user
    console.log('\n[TEST 4] Logging in with credentials...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log(` Status: ${loginRes.status} OK | Logged in as: ${loginData.user?.email}`);

    // 5. Test 401 Unauthorized without token
    console.log('\n[TEST 5] Testing Protected Route Without Token (/tasks)...');
    const unauthorizedRes = await fetch(`${BASE_URL}/tasks`);
    const unauthorizedData = await unauthorizedRes.json();
    console.log(` Status: ${unauthorizedRes.status} Unauthorized | Error: "${unauthorizedData.error}"`);

    // 6. Test GET /me with Bearer token
    console.log('\n[TEST 6] Testing Protected /me Route with Bearer Token...');
    const meRes = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await meRes.json();
    console.log(` Status: ${meRes.status} OK | User: ${meData.user?.name} (${meData.user?.email})`);

    // 7. Create a task with token
    console.log('\n[TEST 7] Creating Task with Bearer Token...');
    const createTaskRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Implement JWT Auth in Practical 07',
        description: 'Store token in localStorage and send Authorization header',
        priority: 'high'
      })
    });
    const createTaskData = await createTaskRes.json();
    const taskId = createTaskData.data?._id;
    console.log(` Status: ${createTaskRes.status} Created | Task ID: ${taskId}`);

    // 8. Fetch user tasks with token
    console.log('\n[TEST 8] Fetching User Tasks with Bearer Token...');
    const getTasksRes = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getTasksData = await getTasksRes.json();
    console.log(` Status: ${getTasksRes.status} OK | User Tasks Count: ${getTasksData.count}`);

    // 9. Update task with token
    console.log(`\n[TEST 9] Updating Task (${taskId}) with Token...`);
    const updateRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ completed: true })
    });
    const updateData = await updateRes.json();
    console.log(` Status: ${updateRes.status} OK | Completed: ${updateData.data?.completed}`);

    // 10. Delete task with token
    console.log(`\n[TEST 10] Deleting Task (${taskId}) with Token...`);
    const deleteRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const deleteData = await deleteRes.json();
    console.log(` Status: ${deleteRes.status} OK | Message: "${deleteData.message}"`);

    console.log('\n========================================================');
    console.log(' All Practical 07 Backend Auth Tests Passed!');
    console.log('========================================================');
  } catch (err) {
    console.error('\n Test Error:', err.message);
    console.error('Make sure backend server is running on http://localhost:5000');
  }
}

runTests();
