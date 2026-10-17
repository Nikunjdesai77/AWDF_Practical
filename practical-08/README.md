# Practical 08: Performance Optimization and Lazy Loading in React

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student:** Nikunj Desai (24CS016)  
**Institute:** Charotar University of Science and Technology (CHARUSAT)  

---

## 1. Objective
To improve frontend performance and initial page load speed using route-based code splitting, `React.lazy()`, and `<Suspense>` fallback UI.

---

## 2. Architecture: Single Bundle vs Code-Split Chunks

### Before (Single Monolithic Bundle)
```text
index.html ──► main.bundle.js (All routes: Home, Projects, Contact, Analytics loaded upfront)
```

### After (Code Splitting with React.lazy & Suspense)
```text
Initial Visit (/):
index.html ──► index.js (Core layout, Home & React runtime only)

Route Navigation (On-Demand):
Visit /projects  ──► Projects-[hash].js (Loaded dynamically)
Visit /contact   ──► Contact-[hash].js (Loaded dynamically)
Visit /analytics ──► Analytics-[hash].js (Loaded dynamically)
```

---

## 3. Bundle Measurement & Before/After Comparison

### Vite Production Build Output
| File | Type | Size | Gzip Size | When Loaded |
|---|---|---|---|---|
| `dist/index.html` | HTML Entry | 0.50 kB | 0.33 kB | Initial Load |
| `dist/assets/index.css` | Stylesheet | 2.06 kB | 0.72 kB | Initial Load |
| `dist/assets/index-[hash].js` | Core App Bundle | 263.44 kB | 83.78 kB | Initial Load |
| `dist/assets/Projects-[hash].js` | Lazy Chunk | 1.80 kB | 0.93 kB | On visit `/projects` |
| `dist/assets/Contact-[hash].js` | Lazy Chunk | 2.81 kB | 1.03 kB | On visit `/contact` |
| `dist/assets/Analytics-[hash].js` | Lazy Chunk | 1.10 kB | 0.48 kB | On visit `/analytics` |

---

## 4. Implementation Details

In `src/App.jsx`:
```javascript
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Dynamic route imports using React.lazy()
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const Analytics = lazy(() => import('./components/Analytics'));

// 2. Wrap routes with Suspense and Fallback
<Suspense fallback={<LoadingFallback />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/analytics" element={<Analytics />} />
  </Routes>
</Suspense>
```

---

## 5. Answers to Key Lab Questions

### Q1: What is the difference between the initial bundle and a lazy-loaded chunk in terms of when each is downloaded?
- **Initial Bundle (`index-[hash].js`):** Downloaded and parsed immediately when the user first opens the web application. It contains only what is essential for the first render (root layout, navigation, and landing page).
- **Lazy-Loaded Chunks (`Projects.js`, `Contact.js`):** Downloaded over the network only when the user explicitly navigates to that specific route. If the user never visits `/contact`, that code is never downloaded.

### Q2: Why does lazy loading improve perceived performance even though the total amount of code downloaded eventually stays the same?
Browsers are single-threaded; parsing and executing JavaScript blocks the main thread.
By deferring non-critical route code:
1. The initial JavaScript payload is smaller.
2. Time to Interactive (TTI) and First Contentful Paint (FCP) improve drastically.
3. Users see and interact with the landing page faster, creating a significantly smoother perceived performance.

### Q3: In what situations would lazy loading not be worth the added complexity?
- **Very Small Applications:** If the entire codebase is only a few tens of kilobytes, the overhead of extra HTTP requests and loading spinners degrades user experience rather than helping.
- **Above-the-Fold Critical UI:** Elements visible immediately on page load should never be lazy loaded.
- **Frequently Used Shared Components:** Over-splitting tiny UI components causes request waterfalls on high-latency mobile networks.

---

## 6. How to Run and Observe Lazy Loading

1. Start the development server:
   ```bash
   cd d:/AWDF/practical-08
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser.
3. Open **DevTools (F12)** -> **Network** tab.
4. Set throttling to **Slow 3G** or **Fast 3G**.
5. Click **Projects**, **Contact**, or **Analytics** in the navigation bar.
6. Observe the `<LoadingFallback />` spinner render on screen while the corresponding `.js` chunk file is fetched over the network!
