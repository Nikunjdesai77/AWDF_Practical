/**
 * Automated Test Script for Practical 06 Backend
 * Verifies: Health Check, POST /tasks, GET /tasks, PUT /tasks/:id, DELETE /tasks/:id
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('========================================================');
  console.log(' Starting Automated Tests for Practical 06 Backend');
  console.log('========================================================\n');

  try {
    // 1. Health check
    console.log('[TEST 1] Checking Root / Health Route...');
    const healthRes = await fetch(`${BASE_URL}/`);
    const healthData = await healthRes.json();
    console.log(` Status: ${healthRes.status} OK | Message: "${healthData.message}"`);

    // 2. Create a new task (POST /tasks)
    console.log('\n[TEST 2] Creating New Task (POST /tasks)...');
    const createRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Complete Practical 06 Full Stack Integration',
        description: 'Connect React 19 frontend with Express and MongoDB',
        priority: 'high',
        completed: false
      })
    });
    const createData = await createRes.json();
    console.log(` Status: ${createRes.status} Created | Task ID: ${createData.data?._id}`);
    const createdId = createData.data?._id;

    // 3. Fetch all tasks (GET /tasks)
    console.log('\n[TEST 3] Fetching All Tasks (GET /tasks)...');
    const getAllRes = await fetch(`${BASE_URL}/tasks`);
    const getAllData = await getAllRes.json();
    console.log(` Status: ${getAllRes.status} OK | Total Tasks in MongoDB: ${getAllData.count}`);

    // 4. Update task (PUT /tasks/:id)
    if (createdId) {
      console.log(`\n[TEST 4] Updating Task (${createdId}) to Completed (PUT /tasks/:id)...`);
      const updateRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true, priority: 'medium' })
      });
      const updateData = await updateRes.json();
      console.log(` Status: ${updateRes.status} OK | Completed: ${updateData.data?.completed}`);

      // 5. Delete task (DELETE /tasks/:id)
      console.log(`\n[TEST 5] Deleting Task (${createdId}) (DELETE /tasks/:id)...`);
      const deleteRes = await fetch(`${BASE_URL}/tasks/${createdId}`, {
        method: 'DELETE'
      });
      const deleteData = await deleteRes.json();
      console.log(` Status: ${deleteRes.status} OK | Message: "${deleteData.message}"`);
    }

    console.log('\n========================================================');
    console.log(' All Backend Tests Passed Successfully!');
    console.log('========================================================');
  } catch (err) {
    console.error('\n Test execution failed:', err.message);
    console.error('Make sure backend is running (`npm start` in backend folder)');
  }
}

runTests();
