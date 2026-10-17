function Projects() {
  const projectList = [
    {
      id: 1,
      title: 'CarIQ – Used Car Price Prediction Dashboard',
      techStack: 'Python, Streamlit, Machine Learning',
      points: [
        'Developed an AI-powered dashboard to analyze used car market trends and predict vehicle prices.',
        'Implemented machine learning model using features like year, fuel type, mileage, and ownership.',
        'Built interactive visualizations for brand analysis, depreciation trends, and market insights.'
      ]
    },
    {
      id: 2,
      title: 'Maze Solver & Visualizer',
      techStack: 'Python, Flask, JavaScript, Three.js',
      points: [
        'Developed a full-stack web application to generate and solve mazes using pathfinding algorithms (BFS, DFS, A*).',
        'Built a Flask-based REST API to handle maze generation and algorithm execution efficiently.',
        'Designed interactive frontend using HTML5 Canvas (2D) and Three.js (3D) for real-time visualization.'
      ]
    },
    {
      id: 3,
      title: 'PG & Tiffin Management System (Client-Based)',
      techStack: 'Data Analysis & System Recommendation',
      points: [
        'Analyzed operational workflows of PG accommodation and tiffin service system for a real client.',
        'Identified inefficiencies in room allocation, billing, and order management processes.',
        'Suggested role-based system design (Admin, Student, Customer) to streamline operations.'
      ]
    }
  ];

  return (
    <section className="portfolio-section">
      <h2>Featured Projects</h2>
      <div className="projects-container">
        {projectList.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p className="project-tech"><strong>Tech Stack:</strong> {project.techStack}</p>
            <ul className="project-points">
              {project.points.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
