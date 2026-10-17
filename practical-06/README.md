# Practical 06: Full Stack Integration (React + Node + MongoDB)

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** Nikunj Desai (24CS016)  
**Institute:** Charotar University of Science and Technology (CHARUSAT)  

---

## 1. Objective
To wire the React frontend to the Node/Express/MongoDB backend into a fully functional, production-ready full-stack application supporting complete state synchronization, real-time feedback, and optimistic UI updates.

---

## 2. Architecture & Data Flow

```text
React Frontend (localhost:5173)
       │
       ▼ (fetch / REST API calls with JSON & CORS)
Express Backend (localhost:5000)
       │
       ▼ (Mongoose ODM)
MongoDB Database (localhost:27017 / awdf_practical6)
```

1. **User Action:** User creates, edits, completes, or deletes a task via the React UI.
2. **Optimistic State:** Local React state updates immediately for a snappy user experience.
3. **API Dispatch:** Centralized API client (`src/api.js`) issues `POST`, `PUT`, or `DELETE` requests to Express.
4. **Backend Validation & Persistence:** Express routes validate payloads and commit data directly to MongoDB.
5. **State Sync & Feedback:** The frontend receives the confirmed MongoDB document, updates state, and displays toast feedback. If an operation fails, state is rolled back and an alert is shown.
6. **Persistence Verification:** Refreshing the browser triggers `GET /tasks` to reload the exact current database state from MongoDB.

---

## 3. Project Structure

```text
practical-06/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose schema with validations and pre-save hooks
│   ├── .env                 # Port (5000) and MongoDB URI
│   ├── .env.example         # Environment template
│   ├── package.json         # Express, Mongoose, CORS, Dotenv
│   └── server.js            # Express REST API with CRUD & error middleware
├── frontend/
│   ├── index.html           # HTML5 root with Google Fonts
│   ├── package.json         # React 19, Vite
│   ├── vite.config.js       # Vite server config
│   └── src/
│       ├── api.js           # Centralized API service for backend communication
│       ├── App.jsx          # Master controller with state management & optimistic UI
│       ├── App.css          # Glassmorphic responsive dark theme
│       ├── index.css        # CSS design tokens & reset
│       ├── main.jsx         # React DOM root
│       └── components/
│           ├── Header.jsx       # App header with tech badges
│           ├── StatsBar.jsx     # Task counters, progress bar & sync button
│           ├── TaskForm.jsx     # New task creation with validation
│           ├── TaskList.jsx     # Search & filterable task list
│           ├── TaskItem.jsx     # Task card with toggle, inline edit & delete
│           ├── ConfirmModal.jsx # Confirmation dialog before deleting
│           ├── Toast.jsx        # Operation success/failure notifications
│           ├── Spinner.jsx      # Loading animation
│           └── ErrorMessage.jsx # Error card with retry trigger
└── README.md
```

---

## 4. Setup and Execution Guide

### Prerequisites
- Node.js (v18+)
- Local MongoDB running on `mongodb://127.0.0.1:27017`

### Step 1: Start the Express Backend Server
1. Open a terminal in `d:/AWDF/practical-06/backend`:
   ```bash
   cd d:/AWDF/practical-06/backend
   npm install
   npm start
   ```
2. The server will start on `http://localhost:5000` and automatically connect to MongoDB (`awdf_practical6`).

### Step 2: Start the React Frontend Dev Server
1. Open a second terminal in `d:/AWDF/practical-06/frontend`:
   ```bash
   cd d:/AWDF/practical-06/frontend
   npm install
   npm run dev
   ```
2. The frontend will launch at `http://localhost:5173`.

---

## 5. Key Questions & Conceptual Analysis

### Q1: What changes are required on the backend (CORS) to allow the React dev server to call the Express API?
Browsers enforce the **Same-Origin Policy**, which prohibits scripts on `http://localhost:5173` from accessing resources on `http://localhost:5000` unless the server explicitly allows it.
We installed `cors` on the backend and configured:
```javascript
const cors = require('cors');
app.use(cors());
```
This adds the `Access-Control-Allow-Origin: *` response header, enabling the React frontend to issue cross-origin `GET`, `POST`, `PUT`, and `DELETE` requests without being blocked by the browser.

### Q2: Why should the UI re-fetch or update local state after a successful POST/PUT/DELETE rather than assuming success silently?
- **Server-Generated Fields:** MongoDB assigns immutable `_id` values and timestamps (`createdAt`). If the frontend merely assumes success without synchronizing, child elements will lack true IDs needed for subsequent `PUT`/`DELETE` calls.
- **Data Integrity:** Network drops or validation constraints may reject a write request. Updating state only upon backend confirmation (or using optimistic UI with rollback on rejection) guarantees that what the user sees matches actual database reality.

### Q3: What is the risk of not handling errors on write operations (POST/PUT/DELETE) the same way as read operations (GET)?
If errors on write operations are ignored:
- The UI can silently appear to have saved or deleted items, but upon page refresh, the user will find their changes gone (data inconsistency).
- The user is left in the dark about validation errors (e.g., missing titles, server disconnections), leading to frustration and silent data loss.

---

## 6. Supplementary Features Implemented

1. **Optimistic UI Updates:** New tasks and completion toggles appear instantly in the UI with a subtle syncing badge; if the server rejects the request, the change is automatically rolled back.
2. **Confirmation Dialog Modal:** Clicking the delete icon prompts a modal showing the exact task title to prevent accidental deletions.
3. **Toast Notifications:** Dynamic slide-in toasts indicate success (green), info (blue), or error (red) after every operation.
4. **Live Metrics Bar:** Real-time counters for Total, Completed, Pending tasks, and Completion percentage bar.
5. **Search & Priority Filtering:** Filter tasks on the fly by completion status, priority (`low`, `medium`, `high`), or keywords.
