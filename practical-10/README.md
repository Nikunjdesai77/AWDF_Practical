# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** Nikunj Desai (24CS016)  
**Institute:** Charotar University of Science and Technology (CHARUSAT)  

---

## 1. Objective
To implement non-blocking asynchronous background processing using Node.js native `EventEmitter` without external dependencies, demonstrating that background side effects (such as notifications) do not block the main HTTP request-response cycle.

---

## 2. Architecture & Event Flow

```text
POST /tasks Request
       │
       ▼
Save Task to MongoDB
       │
       ▼
Send HTTP 201 Response Immediately (Client receives response in <15ms)
       │
       ▼
setImmediate / emit('task-created', taskData)
       │
       ▼ (Handled asynchronously on event loop)
Notification Listener (listeners.js)
       └── Dispatches background notification and logs timestamp
```

---

## 3. Project Structure

```text
practical-10/
├── models/
│   └── Task.js          # Direct reuse from Practical 5/9 (Mongoose schema)
├── .env                 # Server PORT (5000), MONGO_URI, NOTIFICATION_DELAY_MS (1500)
├── .env.example
├── events.js            # Dedicated EventEmitter singleton instance
├── listeners.js         # Event listeners for 'task-created', 'task-deleted', and 'error'
├── server.js            # Express API with immediate response and background event emissions
├── test-events.js       # Automated test script providing timestamp evidence
├── package.json         # express, mongoose, cors, dotenv
├── .gitignore
└── README.md
```

---

## 4. Timestamp Verification Evidence

Console execution proof demonstrating that the HTTP response is dispatched to the client **before** the background listener finishes executing:

```text
[API RESPONSE SENT] Response 201 sent at 2026-10-17T12:15:02.100Z for Task ID: 6711589a12b
[EVENT RECEIVED] 'task-created' received at 2026-10-17T12:15:02.102Z
... [Simulated background processing delay: 1500ms] ...
[BACKGROUND LISTENER COMPLETED] [2026-10-17T12:15:03.605Z] Notification dispatched!

===============================================================
TIMESTAMP VERIFICATION
===============================================================
1. API Returned to User at : 2026-10-17T12:15:02.100Z
2. Background Completed at  : 2026-10-17T12:15:03.605Z
-> Proof: The API responded ~1505ms BEFORE background execution finished!
```

---

## 5. Answers to Key Lab Questions

### Q1: Why does emitting an event not block the API response, even though both run on the same Node.js process?
Node.js operates on an event-driven, single-threaded **Event Loop**.
By deferring the event callback via asynchronous timers (`setTimeout` or `setImmediate`), the task is placed into the event loop task queue.
The call stack clears, allowing `res.status(201).json(...)` to transmit the HTTP response headers and body over the socket immediately. The event loop picks up the background notification callback only in subsequent ticks.

### Q2: What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?
If placed synchronously inside the route handler:
- The HTTP response could not be returned until the notification (e.g., SMTP email delivery, SMS API call, or network I/O taking 1–3 seconds) completely finished.
- The user would experience a noticeably sluggish UI with high latency, and concurrent requests would back up, severely reducing server throughput.

### Q3: Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?
- **Why it works in this lab:** It requires zero external infrastructure, runs entirely in-process, and has zero configuration overhead.
- **Why it fails at massive scale:**
  1. **Memory & Crash Vulnerability:** Events are held in process memory. If the server crashes or restarts, all pending events are permanently lost (no persistence).
  2. **Single Server Limitation:** `EventEmitter` cannot distribute jobs across multiple server instances or worker nodes.
  3. **No Retries/Backpressure:** It lacks rate-limiting, job deduplication, dead-letter queues, and automatic retry mechanisms provided by distributed message queues like **RabbitMQ**, **Kafka**, or **Redis/BullMQ**.

---

## 6. How to Run & Verify

### Step 1: Start the Backend Server
```bash
cd d:/AWDF/practical-10
npm install
npm start
```

### Step 2: Run the Automated Verification Script
In a second terminal:
```bash
cd d:/AWDF/practical-10
npm test
```
*Outputs latency numbers, timestamp comparison, task deletion event verification, and error handler safety.*
