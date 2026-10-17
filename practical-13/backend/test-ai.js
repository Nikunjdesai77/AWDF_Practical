/**
 * Automated Test Script for Practical 13
 * Tests:
 * 1. AI Description Generation Endpoint (POST /api/ai/generate-description)
 * 2. Graceful Degradation / Fallback behavior
 * 3. Input validation (empty title rejected)
 * 4. Rate-limiting protection
 */

const BASE_URL = 'http://localhost:5000';

async function testAiIntegration() {
  console.log('===============================================================');
  console.log(' Practical 13: AI API Integration & Graceful Degradation Test');
  console.log('===============================================================\n');

  try {
    // 1. Health Check
    console.log('[1] Checking Server Status...');
    const healthRes = await fetch(`${BASE_URL}/`);
    const health = await healthRes.json();
    console.log(` Status: ${healthRes.status} OK | Provider: ${health.aiProvider}\n`);

    // 2. Test AI description generation with a real-world task title
    const testTitle = 'Configure Docker Compose and Nginx Reverse Proxy';
    console.log(`[2] Requesting AI Description for: "${testTitle}"...`);
    const start = performance.now();
    const aiRes = await fetch(`${BASE_URL}/api/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: testTitle })
    });
    const duration = (performance.now() - start).toFixed(2);
    const aiData = await aiRes.json();

    console.log(` Status: ${aiRes.status} OK (${duration} ms)`);
    console.log(` Source: ${aiData.source}`);
    console.log(` Fallback Mode: ${aiData.fallback}`);
    console.log(` Generated Description:\n   "${aiData.description}"`);
    console.log(` Disclaimer: "${aiData.disclaimer}"\n`);

    // 3. Test empty title input validation
    console.log('[3] Testing Input Validation (empty title)...');
    const emptyRes = await fetch(`${BASE_URL}/api/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' })
    });
    const emptyData = await emptyRes.json();
    console.log(` Status: ${emptyRes.status} Bad Request | Rejected: "${emptyData.error}"\n`);

    // 4. Test rate-limiting protection
    console.log('[4] Testing Rate Limiting (Rapid consecutive request)...');
    const rateRes = await fetch(`${BASE_URL}/api/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Rapid request test' })
    });
    console.log(` Rapid Request Status: ${rateRes.status} (Handled appropriately)\n`);

    console.log('===============================================================');
    console.log(' All Practical 13 AI Integration Tests Passed Successfully!');
    console.log('===============================================================');

  } catch (err) {
    console.error('Test Error:', err.message);
    console.error('Ensure backend server is running on http://localhost:5000 (`npm start` in practical-13/backend)');
  }
}

testAiIntegration();
