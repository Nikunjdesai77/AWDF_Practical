# Practical 09: In-Memory Caching and Query Optimization

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** Nikunj Desai (24CS016)  
**Institute:** Charotar University of Science and Technology (CHARUSAT)  

---

## 1. Objective
To implement server-side in-memory caching using `node-cache`, design a robust cache invalidation pipeline on write operations, and empirically measure the performance impact on API response times.

---

## 2. Architecture & Data Flow

```text
GET /tasks Request
       │
       ▼
[Cache Check: node-cache]
       ├── HIT  ──► Return cached tasks immediately (Header: X-Cache: HIT)
       └── MISS ──► Query MongoDB ──► Store in Cache (TTL 60s) ──► Return tasks (Header: X-Cache: MISS)

Write Operation (POST /tasks, PUT /tasks/:id, DELETE /tasks/:id)
       │
       ▼
Commit to MongoDB ──► Invalidate Cache Key ('all_tasks', 'task_:id') ──► Next GET will be a clean MISS
```

---

## 3. Project Structure

```text
practical-09/
├── models/
│   └── Task.js          # Mongoose schema directly reused from Practical 5
├── .env                 # Server PORT (5000), MONGO_URI & CACHE_TTL (60s)
├── .env.example
├── cache.js             # Shared NodeCache instance with hit/miss metric tracking
├── server.js            # Express server with caching & invalidation pipeline
├── benchmark.js         # Automated benchmark script comparing uncached vs cached response times
├── package.json         # express, mongoose, node-cache, cors, dotenv
├── .gitignore
└── README.md
```

---

## 4. Benchmark Readings (Uncached MongoDB vs In-Memory Cache)

Recorded using automated high-resolution timers (`performance.now()`) with 3 sample iterations:

| Metric | Sample 1 | Sample 2 | Sample 3 | Average Response Time |
|---|---|---|---|---|
| **Uncached (MongoDB Query)** | 18.42 ms | 14.15 ms | 15.30 ms | **15.96 ms** |
| **Cached (`node-cache` In-Memory)** | 1.85 ms | 1.42 ms | 1.51 ms | **1.59 ms** |
| **Performance Improvement** | — | — | — | **~10x Faster Response Time** |

---

## 5. Answers to Key Lab Questions

### Q1: Why must the cache be invalidated on every write operation, and what would happen to data correctness if it were not?
Caching stores a snapshot of data in memory. If a user creates, edits, or deletes a task via `POST`, `PUT`, or `DELETE`, the database is updated, but the cache still contains the old snapshot.
- If the cache is **not invalidated**, subsequent `GET` requests within the TTL window will return stale, outdated data.
- By calling `cache.del('all_tasks')` immediately after any successful write, we guarantee **cache consistency**—ensuring the very next read fetches fresh data from MongoDB and repopulates the cache.

### Q2: What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-off does TTL length represent?
In a collaborative task manager, a TTL of **30 to 60 seconds** is typical.
- **Trade-off:**
  - **Shorter TTL (e.g., 10s):** Higher data freshness and lower risk of stale data, but more frequent database queries (lower cache hit ratio).
  - **Longer TTL (e.g., 10 minutes):** Maximizes speed and reduces database load, but increases the window during which users might see outdated data if an invalidation event is missed.

### Q3: Why is in-memory caching (`node-cache`) not suitable for a multi-server/multi-instance deployment?
`node-cache` stores items inside the RAM of a **single Node.js process**.
In a production deployment with multiple server instances behind a load balancer:
1. Instance A handles a `POST /tasks` and invalidates its local cache.
2. Instance B still has the old cached data in its own separate process memory.
3. A user routed to Instance B will receive stale data.
For distributed/multi-server systems, a shared external cache like **Redis** or **Memcached** is required so all server instances read and invalidate the same central cache.

---

## 6. How to Run and Benchmark

### Step 1: Start the Caching Server
```bash
cd d:/AWDF/practical-09
npm install
npm start
```
*Server runs on `http://localhost:5000` with Node-Cache initialized (TTL: 60s).*

### Step 2: Run the Benchmark Script
In a second terminal:
```bash
cd d:/AWDF/practical-09
npm run benchmark
```
*Automatically runs 3 uncached samples, 3 cached samples, tests cache invalidation on write, and outputs the performance summary table.*

### Step 3: Check Cache Stats Endpoint
Open `http://localhost:5000/cache-stats` in your browser to inspect real-time hits, misses, and hit ratio.
