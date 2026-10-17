# Practical 13: AI API Integration into a Web Application

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** Nikunj Desai (24CS016)  
**Institute:** Charotar University of Science and Technology (CHARUSAT)  

---

## 1. Objective
To integrate an external AI service (OpenAI / Gemini) securely into a full-stack web application from the backend, design a robust **graceful degradation** fallback architecture, and understand responsible AI usage and data governance.

---

## 2. Architecture & Data Flow

```text
React Frontend (localhost:5173)
       │  1. User clicks "✨ Suggest with AI" with task title
       ▼
Express Backend (localhost:5000) - POST /api/ai/generate-description
       │  2. Server reads API key securely from .env (NEVER exposed to frontend)
       ▼
Google Gemini API (gemini-1.5-flash) / OpenAI / Fallback Engine
       │  3. Formulates prompt: "Write a short task description for: <title>"
       ▼
Response returned to Frontend
       └── 4. Populates description textarea as an EDITABLE suggestion with disclaimer
```

### Graceful Degradation / Failure Path
```text
If AI API key is missing / invalid / quota exceeded / network timeout:
       │
       ▼
Backend catches error inside try/catch
       │
       ▼
Contextual Fallback Engine generates a smart, relevant description
       │
       ▼
Returns HTTP 200 with { description, fallback: true, disclaimer }
       └── The core application NEVER crashes and task creation continues seamlessly!
```

---

## 3. Project Structure

```text
practical-13/
├── backend/
│   ├── models/
│   │   └── Task.js          # Reused Mongoose schema
│   ├── .env                 # Server PORT, MONGO_URI, GEMINI_API_KEY (never committed)
│   ├── .env.example
│   ├── server.js            # Express server with /api/ai/generate-description & fallback
│   ├── test-ai.js           # Automated test script for AI endpoint & graceful degradation
│   └── package.json         # express, mongoose, openai, cors, dotenv
├── frontend/
│   ├── src/
│   │   ├── api.js           # Includes generateAiDescription() client method
│   │   ├── components/
│   │   │   └── TaskForm.jsx # Form with "Suggest with AI" button & disclaimer box
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

---

## 4. Answers to Key Lab Questions

### Q1: Why must the AI API key be called from the backend rather than directly from the React frontend?
Any code running in the browser (React, HTML, JavaScript) is public and inspectable.
- If an API key is placed in frontend code or called directly, anyone opening **Browser DevTools -> Network or Sources** can steal the key.
- A compromised key can lead to unauthorized billing, quota exhaustion, or account suspension.
- Calling the AI API exclusively from the Express backend keeps the API key safely stored in server-side environment variables (`.env`).

### Q2: What does 'graceful degradation' mean in this context, and why does it matter?
- **Graceful degradation** is a design principle ensuring that when a non-essential or third-party feature (like an external AI API) fails, the core system continues to operate without breaking the user experience.
- External APIs suffer from rate limits, network outages, billing exhaustion, and maintenance downtimes outside your control.
- In this application, if OpenAI fails or has no key configured, the backend catches the error and serves a high-quality contextual fallback description, allowing the user to continue creating and managing tasks uninterrupted.

### Q3: What are the privacy and governance implications of sending task data to an external AI API?
- **Data Governance:** Sending user inputs across external networks implies transferring data to third-party servers, which may log or process prompts for training.
- **Data that should NEVER be sent to public AI APIs:**
  1. Personally Identifiable Information (PII) like national IDs, phone numbers, or residential addresses.
  2. Financial and health records.
  3. Proprietary intellectual property, trade secrets, passwords, and private API keys.
- **Responsible AI Practice:** The UI always provides a visible disclaimer noting that descriptions are AI-generated and must be reviewed and accepted by the human user before persistence.

---

## 5. How to Run and Test

### Terminal 1: Start Backend Server
```bash
cd d:/AWDF/practical-13/backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` with the AI endpoint ready.*

### Terminal 2: Run Automated AI Tests
```bash
cd d:/AWDF/practical-13/backend
npm test
```
*Tests prompt generation, contextual fallback, input rejection, and rate limiting.*

### Terminal 3: Start Frontend
```bash
cd d:/AWDF/practical-13/frontend
npm install
npm run dev
```
1. Open `http://localhost:5173`.
2. Type a task title (e.g., *"Configure Docker Compose"*).
3. Click **"✨ Suggest with AI"**.
4. Observe the description textarea populate with an editable suggestion accompanied by the AI disclaimer badge!
