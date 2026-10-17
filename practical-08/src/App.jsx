import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import NotFound from './components/NotFound';
import './App.css';

// Lazy loading route-based components (Code Splitting - Practical 8)
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const Analytics = lazy(() => import('./components/Analytics'));

// Meaningful fallback UI displayed while dynamic chunk is loading
function LoadingFallback() {
  return (
    <div className="loading-box">
      <div className="simple-loader"></div>
      <p>Loading page chunk...</p>
    </div>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : '';
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="main-content">
        {/* Route-level code splitting using Suspense fallback */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
