import React, { useState } from 'react';
import { generateAiDescription } from '../api';

export default function TaskForm({ onAddTask, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [formError, setFormError] = useState('');

  // Practical 13: AI Generation States
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);

  const handleGenerateAi = async () => {
    if (!title.trim()) {
      setFormError('Please enter a task title first to generate an AI description.');
      return;
    }

    setFormError('');
    setIsGeneratingAi(true);
    setAiNotice(null);

    try {
      const res = await generateAiDescription(title.trim());
      if (res && res.description) {
        setDescription(res.description);
        setAiNotice({
          source: res.source,
          fallback: res.fallback,
          disclaimer: res.disclaimer || 'AI-generated suggestion. Please review and edit before saving.'
        });
      }
    } catch (err) {
      console.warn('AI generation error:', err.message);
      // Fallback message so user experience remains seamless
      setAiNotice({
        source: 'Local Fallback',
        fallback: true,
        disclaimer: 'AI service unavailable. You can write your description manually.'
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setFormError('Task title is required.');
      return;
    }

    if (trimmedTitle.length > 100) {
      setFormError('Task title cannot exceed 100 characters.');
      return;
    }

    setFormError('');

    const newTaskData = {
      title: trimmedTitle,
      description: description.trim(),
      priority,
      completed: false
    };

    const success = await onAddTask(newTaskData);
    if (success) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAiNotice(null);
    }
  };

  return (
    <div className="task-form-card">
      <div className="form-header">
        <div className="form-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <h3 className="form-title">Create New Task</h3>
      </div>

      {formError && <div className="form-validation-error">{formError}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Task Title <span className="required-star">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g., Implement OAuth Authentication"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (formError) setFormError('');
            }}
            disabled={isSubmitting}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label htmlFor="task-desc" className="form-label" style={{ marginBottom: 0 }}>
              Description <span className="optional-tag">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={handleGenerateAi}
              disabled={isGeneratingAi || !title.trim() || isSubmitting}
              className="btn-ai-generate"
              title="Auto-generate an editable task description using AI"
            >
              {isGeneratingAi ? '✨ Generating...' : '✨ Suggest with AI'}
            </button>
          </div>

          <textarea
            id="task-desc"
            className="form-textarea"
            rows="3"
            placeholder="Brief details or click 'Suggest with AI'..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />

          {aiNotice && (
            <div className="ai-disclaimer-box">
              <small>
                🤖 <strong>{aiNotice.source}:</strong> {aiNotice.disclaimer}
              </small>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group form-group-half">
            <label htmlFor="task-priority" className="form-label">
              Priority
            </label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>

          <div className="form-group form-group-half form-btn-container">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-inline" /> Saving to DB...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Task
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
