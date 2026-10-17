// Automated Test Script for Practical 5 (MongoDB Integration & Schema Validation)
// Usage: node test-api.js (Run while server.js is running)

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting Practical 5 MongoDB & Schema Validation Tests...\n');

  try {
    // 1. GET / - Welcome & DB status endpoint
    console.log('1. Testing GET / (Welcome & DB Status)');
    let res = await fetch(`${BASE_URL}/`);
    let data = await res.json();
    console.log(`   Status: ${res.status} | DB Status: ${data.databaseStatus}`);

    // 2. Schema Validation Failure Test: Missing Required Title
    console.log('\n2. Testing Schema Validation (Missing required title - Expected 400)');
    res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Task without a title',
        priority: 'high'
      })
    });
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 400) | Error: ${data.error}`);
    console.log(`   Structured Details: ${JSON.stringify(data.details)}`);

    // 3. Schema Validation Failure Test: Invalid Priority Enum
    console.log('\n3. Testing Schema Validation (Invalid priority enum - Expected 400)');
    res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Learn Mongoose',
        priority: 'urgent' // Invalid: must be 'low', 'medium', or 'high'
      })
    });
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 400) | Error: ${data.error}`);
    console.log(`   Structured Details: ${JSON.stringify(data.details)}`);

    // 4. Successful Task Creation (with Pre-save trim testing & priority enum)
    console.log('\n4. Testing POST /tasks (Successful Creation with Pre-save Hook)');
    res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '   Build Full-Stack Task Manager   ', // Extra spaces to test pre-save trim
        description: 'Prepare for Practical 6 full-stack integration',
        completed: false,
        priority: 'high'
      })
    });
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 201) | Stored Title: '${data.data?.title}'`);
    console.log(`   Generated MongoDB _id: ${data.data?._id}`);
    const newId = data.data?._id;

    if (newId) {
      // 5. GET /tasks/:id (Read Single Document)
      console.log(`\n5. Testing GET /tasks/${newId} (Find by ID)`);
      res = await fetch(`${BASE_URL}/tasks/${newId}`);
      data = await res.json();
      console.log(`   Status: ${res.status} (Expected 200) | Priority: ${data.data?.priority}`);

      // 6. PUT /tasks/:id (Update Document)
      console.log(`\n6. Testing PUT /tasks/${newId} (Update with Validators)`);
      res = await fetch(`${BASE_URL}/tasks/${newId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: true,
          priority: 'medium'
        })
      });
      data = await res.json();
      console.log(`   Status: ${res.status} (Expected 200) | Completed: ${data.data?.completed}`);

      // 7. DELETE /tasks/:id (Delete Document)
      console.log(`\n7. Testing DELETE /tasks/${newId} (Delete Document)`);
      res = await fetch(`${BASE_URL}/tasks/${newId}`, { method: 'DELETE' });
      data = await res.json();
      console.log(`   Status: ${res.status} (Expected 200) | Deleted: ${data.message}`);

      // 8. GET /tasks/:id after deletion (Expected 404)
      console.log(`\n8. Testing GET /tasks/${newId} after deletion (Expected 404)`);
      res = await fetch(`${BASE_URL}/tasks/${newId}`);
      data = await res.json();
      console.log(`   Status: ${res.status} (Expected 404) | Error: ${data.error}`);
    }

    // 9. Testing invalid ObjectId format (Expected 404 / 400)
    console.log('\n9. Testing GET /tasks/invalid-id-123 (Expected 404)');
    res = await fetch(`${BASE_URL}/tasks/invalid-id-123`);
    data = await res.json();
    console.log(`   Status: ${res.status} (Expected 404) | Error: ${data.error}`);

    console.log('\nAll Practical 5 Tests Completed!\n');
  } catch (err) {
    console.error('Test script error:', err.message);
  }
}

runTests();
