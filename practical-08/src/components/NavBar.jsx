import { NavLink } from 'react-router-dom';

function NavBar({ isDarkMode, toggleTheme }) {
  return (
    <nav className="portfolio-nav">
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          Projects
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          Contact
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          Analytics
        </NavLink>
      </div>

      <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </nav>
  );
}

export default NavBar;
