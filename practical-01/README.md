# Practical 1: Introduction to React and Component Architecture

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Institution:** Charotar University of Science and Technology (CHARUSAT)

---

## Objective
To set up a React development environment using Vite and build a static UI for a student portfolio using independently structured, reusable components.

---

## Component Architecture

```
App.jsx
 ├── Header.jsx   (Receives name, title, and themeColor props)
 ├── About.jsx    (Displays short student bio)
 ├── Skills.jsx   (Receives skillList array prop and renders dynamic list)
 ├── Projects.jsx (Renders list of academic projects)
 └── Footer.jsx   (Displays contact info and roll number)
```

---

## Features Implemented
1. **Component Independence:** Each section is isolated in `src/components/`.
2. **Props Passing:**
   - `Header.jsx`: Receives `name`, `title`, and `themeColor` props.
   - `Skills.jsx`: Receives `skillList` array prop dynamically mapped using `.map()`.
   - `Footer.jsx`: Receives `contactEmail` and `rollNo` props.
3. **Supplementary / Post-Lab Work:**
   - Inline styling applied via `themeColor` prop in Header.
   - Separate `Projects.jsx` component displaying academic projects.
4. **Basic & Clean Submission Styling:** Lightweight standard CSS without heavy animations, optimized for academic submission.

---

## How to Run the Project

1. Navigate to the practical directory:
   ```bash
   cd practical-01
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
