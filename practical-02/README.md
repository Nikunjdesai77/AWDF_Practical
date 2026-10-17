# Practical 2: State Management and Routing in React

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Student:** Nikunj Desai (24CS016)

---

## Objective
To implement reactive state management using `useState` and multi-page navigation using `react-router-dom` in the student portfolio application.

---

## Component Architecture & Routing Structure

```
App.jsx (wrapped in <BrowserRouter> inside main.jsx)
 ├── NavBar.jsx (client-side navigation with NavLink + Theme Toggle)
 ├── Routes:
 │    ├── Route: "/"          → Home.jsx (About Me + Technical Skills)
 │    ├── Route: "/projects"  → Projects.jsx (Academic & Resume Projects)
 │    ├── Route: "/contact"   → Contact.jsx (Controlled Form + useState)
 │    └── Route: "*"          → NotFound.jsx (404 Error Component)
 └── Footer.jsx (Contact information and roll number)
```

---

## Key Features Implemented

1. **Client-Side Routing (`react-router-dom` v6):**
   - Implemented `BrowserRouter`, `Routes`, and `Route`.
   - `NavBar` component utilizes `NavLink` (not `<a>` tags) for seamless routing without full page reloads.
   - Highlights active navigation link.

2. **State Management (`useState` hook):**
   - **Controlled Inputs:** `senderName` and `message` states capture user input in real time.
   - **Live State Preview:** Displays user-typed text in real time beneath the form.
   - **Live Character Counter:** Displays character length of the controlled message input dynamically.
   - **UI Visibility Toggle:** `showHelp` state toggles form guidelines / instructions.
   - **Dark / Light Mode Toggle:** `isDarkMode` state toggles theme styling across the root component.

3. **Error Handling (404 Page):**
   - Supplementary requirement: `NotFound.jsx` displays a friendly 404 message for any undefined route with a link to return home.

---

## How to Run the Project

1. Navigate to the practical-02 directory:
   ```bash
   cd practical-02
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
