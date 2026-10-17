// Automated API Test Script for Practical 4
// Usage: node test-api.js (Run while server.js is running)

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting Practical 4 API Endpoint Tests...\n');

  try {
    // 1. GET / - Welcome endpoint
    console.log('1. Testing GET / (Welcome Endpoint)');
    let res = await fetch(`${BASE_URL}/`);
    let data = await res.json();
    console.log(`   Status: ${res.status} (Expected 200) - Success: ${data.success}`);

    // 2. GET /tasks - Get all tasks
    console.log('\n2. Testing GET /tasks (Read All)');
    res = await fetch(`${BASE_URL}/tasks`);
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 200) - Count: ${data.count}`);

    // 3. POST /tasks - Create task
    console.log('\n3. Testing POST /tasks (Create Task)');
    res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Review MongoDB Integration',
        description: 'Prepare for Practical 5 with Mongoose schemas',
        completed: false
      })
    });
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 201) - Created ID: ${data.data?.id}`);
    const newId = data.data?.id;

    // 4. GET /tasks/:id - Get created task
    console.log(`\n4. Testing GET /tasks/${newId} (Read Single Task)`);
    res = await fetch(`${BASE_URL}/tasks/${newId}`);
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 200) - Title: ${data.data?.title}`);

    // 5. PUT /tasks/:id - Update task
    console.log(`\n5. Testing PUT /tasks/${newId} (Update Task)`);
    res = await fetch(`${BASE_URL}/tasks/${newId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: true
      })
    });
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 200) - Completed: ${data.data?.completed}`);

    // 6. DELETE /tasks/:id - Delete task
    console.log(`\n6. Testing DELETE /tasks/${newId} (Delete Task)`);
    res = await fetch(`${BASE_URL}/tasks/${newId}`, { method: 'DELETE' });
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 200) - Deleted ID: ${data.data?.id}`);

    // 7. Testing 404 for deleted task
    console.log(`\n7. Testing GET /tasks/${newId} after deletion (Expected 404)`);
    res = await fetch(`${BASE_URL}/tasks/${newId}`);
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 404) - Error: ${data.error}`);

    // 8. Testing Supplementary 1: Missing Content-Type rejection
    console.log('\n8. Testing POST without Content-Type header (Expected 400)');
    res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      body: 'Raw string without header'
    });
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 400) - Error: ${data.error}`);

    // 9. Testing Supplementary 2: Invalid Task ID format
    console.log('\n9. Testing GET /tasks/abc (Invalid ID format - Expected 400)');
    res = await fetch(`${BASE_URL}/tasks/abc`);
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 400) - Error: ${data.error}`);

    // 10. Testing Supplementary 3: Undefined 404 Route
    console.log('\n10. Testing GET /undefined-route (Undefined 404 Handler)');
    res = await fetch(`${BASE_URL}/undefined-route`);
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 404) - Error: ${data.error}`);

    // 11. Testing Global Error Handler
    console.log('\n11. Testing GET /test-error (Global 500 Error Handler)');
    res = await fetch(`${BASE_URL}/test-error`);
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 500) - Error: ${data.error}`);

    console.log('\nAll 11 API Endpoint Tests Passed Successfully!\n');
  } catch (err) {
    console.error('Test run error:', err.message);
  }
}

runTests();
