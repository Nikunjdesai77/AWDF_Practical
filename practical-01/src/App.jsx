import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

function App() {
  const studentData = {
    name: 'Nikunj Desai',
    title: 'Computer Engineering Student | B.Tech (2024 – 2028)',
    rollNo: '24CS016',
    email: 'desainikunj121@gmail.com',
    phone: '+91-8200388025'
  };

  const themeColor = '#1e40af';

  const skillCategories = {
    'Languages': ['Python', 'C++', 'C', 'Java'],
    'Web Development': ['HTML', 'CSS', 'JavaScript', 'React.js'],
    'Machine Learning': ['NumPy', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Plotly'],
    'Frameworks': ['Flask', 'FastAPI', 'Streamlit'],
    'Databases': ['MySQL', 'MongoDB', 'SQLite'],
    'Core Subjects': ['Data Structures & Algorithms', 'OOP', 'DBMS'],
    'Tools & Platforms': ['Git', 'GitHub', 'Docker', 'Anaconda']
  };

  return (
    <div className="portfolio-app">
      {/* 1. Header component receives student name, title, contact info, and theme color via props */}
      <Header
        name={studentData.name}
        title={studentData.title}
        contactInfo={studentData}
        themeColor={themeColor}
      />

      <main className="portfolio-main">
        {/* 2. About component displays bio and academic background */}
        <About />

        {/* 3. Skills component dynamically receives skill categories via props */}
        <Skills skillCategories={skillCategories} />

        {/* 4. Projects component displays real projects from resume */}
        <Projects />
      </main>

      {/* 5. Footer component receives contact details and roll number via props */}
      <Footer
        contactEmail={studentData.email}
        phone={studentData.phone}
        rollNo={studentData.rollNo}
      />
    </div>
  );
}

export default App;
