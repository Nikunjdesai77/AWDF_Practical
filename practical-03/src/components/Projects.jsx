import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import RepoList from './RepoList';

function Projects() {
  // Step 1: Set up state variables for data, loading, and error
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Supplementary: Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Target GitHub username
  const githubUsername = 'Nikunjdesai77';

  // Function to fetch GitHub repositories
  const fetchRepos = (triggerError = false) => {
    setLoading(true);
    setError(null);

    const url = triggerError
      ? 'https://api.github.com/users/non_existent_user_999999_xyz/repos'
      : `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=30`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          setRepos([]);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch repositories.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Step 2: Use useEffect to fetch data on component mount
  useEffect(() => {
    fetchRepos();
  }, []);

  // Filter repositories dynamically based on search query
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProjects = [
    {
      id: 1,
      title: 'CarIQ – Used Car Price Prediction Dashboard',
      tech: 'Python, Streamlit, Machine Learning',
      desc: 'AI-powered dashboard analyzing used car trends with interactive ML price prediction.'
    },
    {
      id: 2,
      title: 'Maze Solver & Visualizer',
      tech: 'Python, Flask, JavaScript, Three.js',
      desc: 'Full-stack application visualizing BFS, DFS, and A* pathfinding algorithms in 2D and 3D.'
    },
    {
      id: 3,
      title: 'PG & Tiffin Management System',
      tech: 'Data Analysis & System Recommendation',
      desc: 'Client-based operational analysis and system design for accommodation and billing workflow.'
    }
  ];

  return (
    <div className="projects-view">
      {/* 1. Featured Academic / Resume Projects */}
      <section className="portfolio-section">
        <h2>Featured Resume Projects</h2>
        <div className="projects-container">
          {featuredProjects.map((p) => (
            <div key={p.id} className="project-card">
              <h3>{p.title}</h3>
              <p className="project-tech"><strong>Tech Stack:</strong> {p.tech}</p>
              <p className="project-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Live GitHub API Integration (Practical 3 Core Requirement) */}
      <section className="portfolio-section api-projects-section">
        <div className="api-section-header">
          <h2>Live GitHub Repositories (REST API Integration)</h2>
          <span className="api-user-tag">User: @{githubUsername}</span>
        </div>

        <p className="api-description">
          Fetched dynamically via GitHub REST API using <code>useEffect</code> with loading, error, and search filtering states.
        </p>

        {/* Search Filter & Test Error Controls */}
        <div className="api-controls">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search repositories by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="api-action-buttons">
            <button
              type="button"
              className="btn-refresh"
              onClick={() => fetchRepos(false)}
              disabled={loading}
            >
              🔄 Refresh
            </button>
            <button
              type="button"
              className="btn-test-error"
              onClick={() => fetchRepos(true)}
              title="Test error boundary state as per Lab Step 6"
            >
              ⚠️ Test Error State
            </button>
          </div>
        </div>

        {/* Step 3: Conditionally render based on state */}
        {loading && <Spinner />}

        {!loading && error && (
          <ErrorMessage
            message={error}
            onRetry={() => fetchRepos(false)}
          />
        )}

        {!loading && !error && (
          <RepoList data={filteredRepos} />
        )}
      </section>
    </div>
  );
}

export default Projects;
