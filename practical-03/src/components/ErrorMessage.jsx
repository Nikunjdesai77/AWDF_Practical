function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <h3>Failed to Load Data</h3>
      <p>{message || 'An error occurred while fetching repositories.'}</p>
      {onRetry && (
        <button type="button" className="btn-retry" onClick={onRetry}>
          ↻ Retry Request
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
