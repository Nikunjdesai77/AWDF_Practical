# Practical 3: API Integration and Data Rendering in React

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Student:** Nikunj Desai (24CS016)

---

## Objective
To consume a REST API (GitHub REST API) in React and manage asynchronous data with loading, success, and error states using `useEffect` and `useState`.

---

## Component Architecture & Diagram

```
Projects.jsx
 ├── useEffect() → triggers fetch on mount
 ├── useState: repos, loading, error, searchQuery
 ├── [loading]   → <Spinner />
 ├── [error]     → <ErrorMessage message={error} onRetry={fetchRepos} />
 └── [success]   → <RepoList data={filteredRepos} />
```

---

## Key Features Implemented

1. **REST API Integration:**
   - Consumes GitHub REST API: `https://api.github.com/users/Nikunjdesai77/repos`
   - Uses `useEffect` with an empty dependency array `[]` to initiate network request on component mount.

2. **Asynchronous State Management (`useState`):**
   - `repos`: Holds array of repositories retrieved from API.
   - `loading`: Boolean flag displaying `<Spinner />` during network latency.
   - `error`: Holds error message if network or HTTP request fails, displaying `<ErrorMessage />`.

3. **Supplementary & Post-Laboratory Tasks:**
   - **Retry Button:** Added in `<ErrorMessage />` allowing the user to re-trigger the fetch immediately upon error.
   - **Test Error State:** Button included to demonstrate the error state handling by temporarily hitting an invalid endpoint.
   - **Search / Filter Input:** Allows dynamic client-side filtering of repositories by name.
   - **Repository Metadata:** Displays repository name with clickable GitHub URL, star count (`stargazers_count`), language badge, and fork count.

---

## How to Run the Project

1. Navigate to the practical-03 directory:
   ```bash
   cd practical-03
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
