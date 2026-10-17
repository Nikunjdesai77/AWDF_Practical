import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-view">
      <h2>404 - Page Not Found</h2>
      <p>The page or route you are looking for does not exist in this application.</p>
      <Link to="/" className="btn-home-link">← Return to Home Page</Link>
    </div>
  );
}

export default NotFound;
