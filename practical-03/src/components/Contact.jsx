import { useState } from 'react';

function Contact({ studentInfo }) {
  // useState 1: Controlled input for user message / query
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');

  // useState 2: Toggle UI visibility (Help Tooltip / Guidelines toggle)
  const [showHelp, setShowHelp] = useState(false);

  // Status message state upon submission
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSenderName('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <section className="portfolio-section contact-section">
      <h2>Contact & Query Form</h2>

      <div className="contact-info-card">
        <p><strong>Direct Email:</strong> <a href={`mailto:${studentInfo?.email}`}>{studentInfo?.email}</a></p>
        <p><strong>Phone:</strong> {studentInfo?.phone}</p>
        <p><strong>Roll No:</strong> {studentInfo?.rollNo}</p>
      </div>

      {/* UI Visibility Toggle using useState */}
      <div className="toggle-container">
        <button
          type="button"
          className="btn-toggle"
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? 'Hide Form Instructions ▲' : 'Show Form Instructions ▼'}
        </button>

        {showHelp && (
          <div className="help-box">
            <p><strong>Instructions:</strong> Type your message into the controlled input below. As you type, the character count and live preview will update in real time using React <code>useState</code>.</p>
          </div>
        )}
      </div>

      {/* Controlled Form */}
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="senderName">Your Name:</label>
          <input
            id="senderName"
            type="text"
            className="form-input"
            placeholder="Enter your full name"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="userMessage">Your Message (Controlled Input):</label>
          <textarea
            id="userMessage"
            className="form-textarea"
            rows="4"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (submitted) setSubmitted(false);
            }}
            required
          />
          {/* Live character count from supplementary problem */}
          <div className="char-counter">
            Character count: <strong>{message.length}</strong>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">Submit Message</button>
          <button type="button" className="btn-reset" onClick={handleReset}>Clear</button>
        </div>
      </form>

      {/* Real-time controlled input preview */}
      <div className="live-preview-box">
        <h3>Real-time State Preview:</h3>
        <p><strong>Sender:</strong> {senderName || '(typing...)'}</p>
        <p><strong>Live Captured Text:</strong> {message || '(no input typed yet)'}</p>
      </div>

      {submitted && (
        <div className="submission-alert">
          Thank you, <strong>{senderName}</strong>! Your message has been received successfully in state.
        </div>
      )}
    </section>
  );
}

export default Contact;
