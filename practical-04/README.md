# Practical 4: Building a RESTful API with Node.js and Express

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Student:** Nikunj Desai (24CS016)

---

## Objective
To design and implement a RESTful backend server with complete CRUD endpoints for a Task Management system using the Express middleware pipeline.

---

## Architecture & Middleware Pipeline

```
Client (Postman / Browser / Test Script)
 │
 ▼
[CORS Middleware]
 │
 ▼
[express.json() Body Parser]
 │
 ▼
[Global Request Logging Middleware] (Method, URL, Timestamp)
 │
 ▼
Express Router & Route-Specific Middlewares:
 ├── [validateContentType]    (Rejects POST/PUT without application/json)
 ├── [validateTaskId]         (Validates :id parameter format)
 │
 ├── GET    /tasks            → Return all tasks (HTTP 200)
 ├── GET    /tasks/:id        → Return single task by ID (HTTP 200 / 404)
 ├── POST   /tasks            → Create new task (HTTP 201)
 ├── PUT    /tasks/:id        → Update existing task (HTTP 200 / 404)
 └── DELETE /tasks/:id        → Delete task (HTTP 200 / 404)
 │
 ▼
[404 Route Handler]           (Catches all undefined endpoints)
 │
 ▼
[Global Error Handler]        (Centralized error handler - HTTP 500)
```

---

## Key Features & Middlewares Implemented

1. **Complete In-Memory CRUD Operations:**
   - Full support for Create, Read (all/single), Update, and Delete on tasks with appropriate HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

2. **Global Request Logger:**
   - Logs incoming request method, URL, and ISO timestamp before forwarding to handlers using `next()`.

3. **Supplementary Middlewares:**
   - **Content-Type Validation:** Enforces `Content-Type: application/json` on `POST` and `PUT` requests, rejecting invalid headers with `400 Bad Request`.
   - **Task ID Validation:** Verifies that `:id` route parameters are positive integers before reaching the controller.
   - **Custom 404 Route Handler:** Catches unhandled routes and returns structured JSON responses.
   - **Centralized Error Handler:** Positioned as the final middleware with 4 parameters `(err, req, res, next)` to catch unhandled runtime exceptions gracefully.

---

## How to Run the Server

1. Navigate to the practical-04 directory:
   ```bash
   cd practical-04
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Express server:
   ```bash
   npm start
   ```
   *(Server starts at `http://localhost:5000`)*

4. Run automated test suite:
   ```bash
   node test-api.js
   ```
