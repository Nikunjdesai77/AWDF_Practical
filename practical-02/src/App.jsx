import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import './App.css';

function App() {
  // useState for theme toggle (Dark/Light mode supplementary requirement)
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

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
    <div className={`portfolio-app ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 1. Header component */}
      <Header
        name={studentData.name}
        title={studentData.title}
        contactInfo={studentData}
        themeColor={themeColor}
      />

      {/* 2. Navigation Bar with client-side routing and theme toggle */}
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* 3. Main multi-route view using React Router */}
      <main className="portfolio-main">
        <Routes>
          <Route path="/" element={<Home skillCategories={skillCategories} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact studentInfo={studentData} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* 4. Footer component */}
      <Footer
        contactEmail={studentData.email}
        phone={studentData.phone}
        rollNo={studentData.rollNo}
      />
    </div>
  );
}

export default App;
