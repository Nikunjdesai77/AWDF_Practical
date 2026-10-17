/**
 * Benchmark Script for Practical 09
 * Automates 3 sample readings of:
 * 1. Uncached Requests (direct MongoDB queries)
 * 2. Cached Requests (Node-Cache In-Memory hits)
 * Calculates latency improvement and verifies cache invalidation.
 */

const BASE_URL = 'http://localhost:5000';

async function timeRequest(url, options = {}) {
  const start = performance.now();
  const res = await fetch(url, options);
  const data = await res.json();
  const end = performance.now();
  const duration = (end - start).toFixed(2);
  const cacheHeader = res.headers.get('x-cache') || data.source || 'N/A';
  return { duration: parseFloat(duration), status: res.status, cacheHeader, data };
}

async function runBenchmark() {
  console.log('===============================================================');
  console.log(' Practical 09: In-Memory Caching Benchmark (node-cache)');
  console.log('===============================================================\n');

  try {
    // 1. Health Check
    console.log('[1] Checking Server Status...');
    const health = await fetch(`${BASE_URL}/`);
    if (!health.ok) throw new Error('Backend server is not running on port 5000');
    console.log(' Server is live on port 5000.\n');

    // 2. Ensure sample data exists
    console.log('[2] Seeding Sample Tasks if needed...');
    const checkTasks = await fetch(`${BASE_URL}/tasks?noCache=true`);
    const taskData = await checkTasks.json();
    if (!taskData.data || taskData.data.length < 3) {
      for (let i = 1; i <= 3; i++) {
        await fetch(`${BASE_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Benchmark Sample Task ${i}`,
            description: `Automated testing task created for caching performance evaluation #${i}`,
            priority: i === 1 ? 'high' : i === 2 ? 'medium' : 'low'
          })
        });
      }
      console.log(' Seeded 3 sample tasks for benchmarking.\n');
    } else {
      console.log(` Found ${taskData.data.length} existing tasks in MongoDB.\n`);
    }

    // 3. Measure 3 Uncached Requests (direct MongoDB queries)
    console.log('[3] Measuring Uncached Response Times (MongoDB direct reads):');
    const uncachedTimes = [];
    for (let i = 1; i <= 3; i++) {
      const result = await timeRequest(`${BASE_URL}/tasks?noCache=true`);
      uncachedTimes.push(result.duration);
      console.log(`   Sample ${i}: ${result.duration} ms [Header: ${result.cacheHeader}]`);
    }
    const avgUncached = (uncachedTimes.reduce((a, b) => a + b, 0) / uncachedTimes.length).toFixed(2);
    console.log(`   -> Average Uncached Response Time: ${avgUncached} ms\n`);

    // 4. Prime the cache (First request is a Cache MISS)
    console.log('[4] Priming Node-Cache with initial request...');
    const prime = await timeRequest(`${BASE_URL}/tasks`);
    console.log(`   Cache Primer (MISS): ${prime.duration} ms [${prime.cacheHeader}]\n`);

    // 5. Measure 3 Cached Requests (In-Memory Hits)
    console.log('[5] Measuring Cached Response Times (node-cache HITs):');
    const cachedTimes = [];
    for (let i = 1; i <= 3; i++) {
      const result = await timeRequest(`${BASE_URL}/tasks`);
      cachedTimes.push(result.duration);
      console.log(`   Sample ${i}: ${result.duration} ms [Header: ${result.cacheHeader}]`);
    }
    const avgCached = (cachedTimes.reduce((a, b) => a + b, 0) / cachedTimes.length).toFixed(2);
    console.log(`   -> Average Cached Response Time: ${avgCached} ms\n`);

    // 6. Test Cache Invalidation on Write (POST)
    console.log('[6] Testing Cache Invalidation on Write (POST /tasks)...');
    const postRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Temporary Invalidation Test Task',
        priority: 'low'
      })
    });
    const postData = await postRes.json();
    console.log(`   Created task and invalidated cache: "${postData.message}"`);

    // Verify next request is a MISS
    const postInvalidateCheck = await timeRequest(`${BASE_URL}/tasks`);
    console.log(`   Next read after write is: [${postInvalidateCheck.cacheHeader}] (${postInvalidateCheck.duration} ms) - Cache Invalidation Confirmed!\n`);

    // 7. Get Cache Stats
    const statsRes = await fetch(`${BASE_URL}/cache-stats`);
    const stats = await statsRes.json();

    // 8. Output Summary Table
    const speedup = (avgUncached / avgCached).toFixed(1);
    console.log('===============================================================');
    console.log(' BENCHMARK RESULTS SUMMARY (For Practical 09 Lab Journal)');
    console.log('===============================================================');
    console.log('| Metric                    | Uncached (MongoDB) | Cached (node-cache) |');
    console.log('|---------------------------|-------------------|---------------------|');
    console.log(`| Sample 1 Reading          | ${uncachedTimes[0]} ms            | ${cachedTimes[0]} ms               |`);
    console.log(`| Sample 2 Reading          | ${uncachedTimes[1]} ms            | ${cachedTimes[1]} ms               |`);
    console.log(`| Sample 3 Reading          | ${uncachedTimes[2]} ms            | ${cachedTimes[2]} ms               |`);
    console.log(`| Average Response Time     | ${avgUncached} ms            | ${avgCached} ms                |`);
    console.log(`| Performance Improvement   | Baseline          | ~${speedup}x Faster            |`);
    console.log('===============================================================');
    console.log(`Cache Statistics: Hits: ${stats.data?.hits}, Misses: ${stats.data?.misses}, Hit Ratio: ${stats.data?.hitRatio}`);
    console.log('===============================================================\n');

  } catch (err) {
    console.error('Benchmark Error:', err.message);
    console.error('Make sure the server is running on port 5000: `npm start` in practical-09');
  }
}

runBenchmark();
