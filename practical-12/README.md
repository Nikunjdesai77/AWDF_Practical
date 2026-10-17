# Practical 12: CI/CD Pipeline with GitHub Actions

[![CI Pipeline](https://github.com/Nikunjdesai77/AWDF_Practical/actions/workflows/ci.yml/badge.svg)](https://github.com/Nikunjdesai77/AWDF_Practical/actions/workflows/ci.yml)

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** Nikunj Desai (24CS016)  
**Institute:** Charotar University of Science and Technology (CHARUSAT)  

---

## 1. Objective
To automate testing and validation of the application using a Continuous Integration (CI) pipeline with GitHub Actions, ensuring every commit pushed to the repository is automatically built, verified, and reported with a clear pass/fail status.

---

## 2. CI Pipeline Architecture

```text
git push origin main
       │
       ▼
GitHub Actions Trigger (on: push, pull_request to main)
       │
       ▼
Job: build-and-test (ubuntu-latest)
       ├── 1. Checkout code (actions/checkout@v4)
       ├── 2. Setup Node.js v20 (actions/setup-node@v4)
       ├── 3. Install dependencies (npm ci)
       └── 4. Run automated test suite (npm test)
       │
       ▼
Results:
       ├── PASS (Green checkmark ✔) ──► All endpoints & validations verified
       └── FAIL (Red cross ✖)      ──► Failure logged; bad code prevented from deploying
```

---

## 3. Workflow Configuration (`.github/workflows/ci.yml`)

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    name: Build & Automated Tests
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: ./practical-12

    steps:
      - name: 1. Checkout Repository
        uses: actions/checkout@v4

      - name: 2. Set up Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: './practical-12/package-lock.json'

      - name: 3. Install Dependencies
        run: npm ci

      - name: 4. Run Automated Test Suite
        run: npm test
```

---

## 4. Automated Tests Implemented (`tests/api.test.js`)

1. **`GET /`**: Validates root metadata returns HTTP 200 and `status: 'success'`.
2. **`GET /health`**: Validates server health returns HTTP 200 and uptime.
3. **`GET /tasks`**: Validates task listing endpoint returns HTTP 200 and an array.
4. **`POST /tasks` (Valid)**: Validates task creation returns HTTP 201 Created.
5. **`POST /tasks` (Empty Title)**: Validates input rejection returns HTTP 400 Bad Request.

---

## 5. Answers to Key Lab Questions

### Q1: What is the difference between Continuous Integration and Continuous Deployment, and which one does this practical actually demonstrate?
- **Continuous Integration (CI):** The practice of regularly merging code changes into a central repository, where automated builds and tests are triggered to detect bugs and integration issues immediately.
- **Continuous Deployment (CD):** The automated process of releasing every passing build directly to staging or production environments (e.g. AWS, Render, Vercel) without human intervention.
- **What this practical demonstrates:** This practical demonstrates **Continuous Integration (CI)**, verifying code correctness and preventing broken code from merging.

### Q2: Why does running tests automatically on every push catch problems earlier than testing manually before a release?
Manual testing right before a release is slow, error-prone, and tests code long after it was written, making it difficult to isolate which commit introduced a bug.
Automated CI testing on every push:
1. Gives immediate feedback within seconds of pushing.
2. Isolates failures directly to the single commit that caused them.
3. Eliminates human oversight and ensures zero untested code enters `main`.

### Q3: What would happen to the pipeline if the test file path were incorrect—would the workflow fail at the same step as a genuine test failure?
- **Workflow Step:** Yes, it would fail at the exact same step: `Run Automated Test Suite` (`npm test`).
- **Root Cause & Log Difference:**
  - An incorrect file path causes a CLI/runtime resolution error (`Error: Cannot find module 'tests/nonexistent.test.js'`), exiting with code 1 before executing any assertions.
  - A genuine test failure starts the runner, executes assertions, and logs assertion errors (`AssertionError: 200 === 400`), showing which specific expectation failed.

---

## 6. How to Run Locally and Verify in GitHub

### Run Tests Locally
```bash
cd d:/AWDF/practical-12
npm install
npm test
```

### Observe on GitHub
1. Push your changes: `git push origin main`.
2. Open your GitHub repository in your browser: `https://github.com/Nikunjdesai77/AWDF_Practical`.
3. Click the **Actions** tab.
4. You will see **CI Pipeline** trigger automatically, execute all steps, and show a green checkmark!
