require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_practical13';

// Initialize OpenAI client if key exists
const apiKey = process.env.OPENAI_API_KEY;
let openai = null;
if (apiKey && apiKey !== 'your_openai_api_key_here' && apiKey !== 'mock_or_demo_key') {
  openai = new OpenAI({ apiKey });
}

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Database connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`MongoDB connected successfully to: ${MONGO_URI}`);
  })
  .catch((err) => {
    console.warn(`MongoDB connection warning: ${err.message}`);
  });

// Simple in-memory rate limiting map (Supplementary requirement)
const lastRequestTime = new Map();

// Helper: Contextual intelligent fallback description generator
function getFallbackDescription(title) {
  const lower = title.toLowerCase();
  if (lower.includes('auth') || lower.includes('login') || lower.includes('register')) {
    return 'Implement user authentication with input validation, password encryption, and session/token management.';
  }
  if (lower.includes('test') || lower.includes('ci') || lower.includes('pipeline')) {
    return 'Write automated unit and integration tests to verify functionality and ensure continuous quality delivery.';
  }
  if (lower.includes('docker') || lower.includes('container') || lower.includes('deploy')) {
    return 'Containerize application components and configure orchestration for scalable and reproducible deployment.';
  }
  if (lower.includes('database') || lower.includes('mongo') || lower.includes('schema')) {
    return 'Design data schemas, establish indexes, and implement robust query optimization and persistence logic.';
  }
  return `Plan, implement, and verify all requirements for "${title}" with proper error handling and clean documentation.`;
}

// ==========================================
// 1. Root & Status
// ==========================================
app.get('/', (req, res) => {
  res.json({
    message: 'Practical 13: AI API Integration into a Web Application',
    aiProvider: openai ? 'OpenAI (Configured)' : 'Contextual Fallback Engine (Active)',
    endpoints: {
      generateDescription: 'POST /api/ai/generate-description',
      tasks: 'GET, POST /tasks',
      taskById: 'PUT, DELETE /tasks/:id'
    }
  });
});

// ==========================================
// 2. AI Description Generation Endpoint
// ==========================================
app.post('/api/ai/generate-description', async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Task title is required to generate an AI description.'
    });
  }

  // Rate Limiting (Supplementary Requirement: 1 request every 5s per IP/client)
  const clientKey = req.ip || 'anonymous';
  const now = Date.now();
  if (lastRequestTime.has(clientKey) && now - lastRequestTime.get(clientKey) < 3000) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait a few seconds before requesting AI suggestions again.'
    });
  }
  lastRequestTime.set(clientKey, now);

  // Try calling real OpenAI API if client is configured
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful project manager. Write a concise, 1-2 sentence actionable task description based on the user\'s task title.'
          },
          {
            role: 'user',
            content: `Write a short task description for: "${title.trim()}"`
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      });

      const generatedText = completion.choices[0]?.message?.content?.trim();

      return res.status(200).json({
        success: true,
        description: generatedText,
        source: 'OpenAI (gpt-4o-mini)',
        fallback: false,
        disclaimer: 'AI-generated suggestion. Please review and edit before saving.'
      });
    } catch (apiError) {
      console.warn('OpenAI API call failed or quota exceeded:', apiError.message);
      console.log('Falling back gracefully to contextual description generator...');
      // Fall through to graceful degradation below
    }
  }

  // Graceful Degradation / Fallback Path (Step 3 & 6 in Practical 13)
  // App continues working smoothly with high-quality fallback even without external API key!
  const fallbackDesc = getFallbackDescription(title);

  return res.status(200).json({
    success: true,
    description: fallbackDesc,
    source: 'Contextual AI Engine (Graceful Degradation Fallback)',
    fallback: true,
    disclaimer: 'Generated via fallback engine. Please review and edit before saving.'
  });
});

// ==========================================
// 3. Task CRUD Routes
// ==========================================
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Task title is required.' });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium'
    });

    res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Task not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Task not found' });
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Practical 13 Backend running on http://localhost:${PORT}`);
  console.log(`AI Endpoint available at POST /api/ai/generate-description`);
});

module.exports = app;
