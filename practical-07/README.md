# Practical 07: Authentication and Middleware Pipeline

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** Nikunj Desai (24CS016)  
**Institute:** Charotar University of Science and Technology (CHARUSAT)  

---

## 1. Objective
To implement JWT-based authentication, password hashing using `bcryptjs`, and input validation as part of the Express middleware pipeline protecting backend task routes.

---

## 2. Architecture & Authentication Flow

```text
POST /register  ──► Hash password (bcrypt) ──► Save User in MongoDB ──► 201 + JWT Token
POST /login     ──► Compare password (bcrypt) ──► Sign JWT (expires 1h) ──► 200 + JWT Token

Protected Route Flow:
Client Request (Authorization: Bearer <token>)
       │
       ▼
[Auth Middleware] ──► Verifies JWT with JWT_SECRET ──► Sets req.user = decoded
       │
       ▼
[Validation Middleware] ──► Validates inputs (e.g., non-empty title)
       │
       ▼
Controller (Task Routes scoped to req.user.id)
```

---

## 3. Project Structure

```text
practical-07/
├── backend/
│   ├── middleware/
│   │   ├── auth.js          # JWT verification & 401 error handling
│   │   └── validate.js      # Server-side input validation middleware
│   ├── models/
│   │   ├── User.js          # User schema (name, unique email, hashed password)
│   │   └── Task.js          # Task schema with user reference (ObjectId)
│   ├── .env                 # Port, MongoDB URI & JWT_SECRET
│   ├── .env.example
│   ├── package.json         # Express, Mongoose, bcryptjs, jsonwebtoken, cors
│   ├── server.js            # Express server with auth and protected CRUD routes
│   └── test-api.js          # Automated test suite for registration, login, JWT & CRUD
├── frontend/
│   ├── index.html           # HTML template
│   ├── package.json         # React 19, Vite
│   ├── vite.config.js
│   └── src/
│       ├── api.js           # API client with JWT token management & 401 redirect
│       ├── App.jsx          # Auth-aware root component
│       ├── App.css          # Basic, clean styling
│       ├── index.css
│       ├── main.jsx
│       └── components/
│           ├── Login.jsx    # Email & password login form
│           ├── Register.jsx # Registration form
│           └── TaskList.jsx # Protected task management UI & logout
├── .gitignore
└── README.md
```

---

## 4. Setup and Execution

### Step 1: Run the Backend Server
```bash
cd d:/AWDF/practical-07/backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` connected to MongoDB (`awdf_practical7`).*

### Step 2: Run Backend Automated Tests
```bash
cd d:/AWDF/practical-07/backend
npm test
```
*Runs all 10 automated test cases (registration, password hashing, invalid input rejection, login, token-based `/me`, 401 checks, and task CRUD).*

### Step 3: Run the Frontend Application
```bash
cd d:/AWDF/practical-07/frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 5. Key Questions & Conceptual Analysis

### Q1: Why must passwords be hashed before storage instead of saved as plain text, even in a lab/demo project?
Storing passwords in plain text creates an immediate security vulnerability. If database logs, backups, or the database itself are compromised, every user's actual password is leaked.
`bcryptjs` is a salted, one-way cryptographic hash function designed to be computationally intensive, preventing rainbow table attacks and brute force cracking.

### Q2: What does the authentication middleware actually verify, and what happens if the token is missing or expired?
The middleware extracts the token from the HTTP `Authorization: Bearer <token>` header and verifies its cryptographic signature using `jwt.verify(token, process.env.JWT_SECRET)`.
- **Missing Token:** The server rejects the request immediately with `401 Unauthorized` (`Access denied. Missing or malformed Authorization header`).
- **Expired/Tampered Token:** `jwt.verify` throws a `TokenExpiredError` or `JsonWebTokenError`. The middleware catches this error in a `try/catch` block and returns `401 Unauthorized` without crashing the server.

### Q3: Why should input validation happen on the server even if the frontend already validates the same fields?
Frontend validation only provides user-friendly immediate feedback, but it can be easily bypassed by using tools like Postman, curl, or directly crafting HTTP requests.
Server-side validation is the single source of truth that ensures data integrity and prevents malformed data or malicious payloads from ever reaching the database.

---

## 6. Supplementary Features Implemented

1. **`/me` Endpoint:** Authenticated route `GET /me` returns current user details (`id`, `name`, `email`) decoded from the token.
2. **Token Expiry & 401 Handling:** When an API request returns `401`, the frontend clears the token from `localStorage` and redirects the user back to the login view.
3. **Logout Mechanism:** A logout button in the navbar clears the stored JWT token and switches the view to the login form.
4. **User-Scoped Tasks:** Each task document contains a `user` reference (`ObjectId`), ensuring users only access and modify their own tasks.
