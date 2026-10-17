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

  // Student profile and skills data directly matching Practical 1 & 2
  const studentData = {
    name: 'Nikunj Desai',
    title: 'Computer Engineering Student | B.Tech (2024 – 2028)',
    rollNo: '24CS016',
    email: 'desainikunj121@gmail.com',
    phone: '+91-8200388025'
  };

  const themeColor = isDarkMode ? '#60a5fa' : '#1e40af';

  const skillCategories = {
    'Languages': ['Python', 'C++', 'C', 'Java'],
    'Web Development': ['HTML', 'CSS', 'JavaScript', 'React.js', 'React Router v6'],
    'Machine Learning': ['NumPy', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Plotly'],
    'Frameworks': ['Flask', 'FastAPI', 'Streamlit'],
    'Databases': ['MySQL', 'MongoDB', 'SQLite'],
    'Core Subjects': ['Data Structures & Algorithms', 'OOP', 'DBMS'],
    'Tools & Platforms': ['Git', 'GitHub', 'Docker', 'Anaconda']
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <Header
        name={studentData.name}
        title={studentData.title}
        contactInfo={studentData}
        themeColor={themeColor}
      />
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="main-content">
        {/* Route-level code splitting using Suspense fallback */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home skillCategories={skillCategories} />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact studentInfo={studentData} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer
        contactEmail={studentData.email}
        phone={studentData.phone}
        rollNo={studentData.rollNo}
      />
    </div>
  );
}
