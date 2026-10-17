# Practical 5: MongoDB Integration and Schema Design with Mongoose

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Student:** Nikunj Desai (24CS016)

---

## Objective
To connect a MongoDB database to an Express server using the Mongoose ODM and enforce strict schema validation, default values, pre-save middleware hooks, and structured error responses.

---

## Architecture & Data Flow

```
Express App
 │
 ▼
Mongoose ODM (Schema & Model Layer: models/Task.js)
 ├── Schema Validation: required, maxlength, enum ['low', 'medium', 'high']
 └── Pre-save Hook: automatic whitespace trimming on title
 │
 ▼
MongoDB Database (tasks collection)
 { _id, title, description, completed, priority, createdAt }
```

---

## Key Features Implemented

1. **Mongoose Schema & Model Design (`models/Task.js`):**
   - `title`: String, required with custom error message, trimmed.
   - `description`: String with default value `''`.
   - `completed`: Boolean with default value `false`.
   - `createdAt`: Date with default value `Date.now`.
   - **Supplementary - Priority Enum:** Restricted to `['low', 'medium', 'high']` (default `'medium'`).
   - **Supplementary - Pre-Save Hook:** Automatically strips leading and trailing whitespace from the `title` before saving.

2. **Full CRUD Operations with Mongoose Methods (`server.js`):**
   - `GET /tasks`: `Task.find().sort({ createdAt: -1 })`
   - `GET /tasks/:id`: `Task.findById(id)` with 404 response if ID is not found.
   - `POST /tasks`: `Task.create(...)` with schema validation.
   - `PUT /tasks/:id`: `Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })`
   - `DELETE /tasks/:id`: `Task.findByIdAndDelete(id)`

3. **Structured Validation Error Handling:**
   - Intercepts Mongoose `ValidationError` and extracts clean, human-readable error messages without leaking raw stack traces to the client (`HTTP 400`).
   - Catches `CastError` for invalid MongoDB `ObjectId` strings.

4. **Environment Configuration:**
   - Database connection string read securely from `.env` via `dotenv`.
   - Included `.env.example` template for repository evaluation.

---

## How to Run the Project

1. Navigate to the practical-05 directory:
   ```bash
   cd practical-05
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure MongoDB is running (locally or via MongoDB Atlas):
   - Update `MONGO_URI` in `.env` if using a remote connection string.

4. Start the server:
   ```bash
   npm start
   ```
   *(Server runs at `http://localhost:5000`)*

5. Run automated test suite:
   ```bash
   node test-api.js
   ```
