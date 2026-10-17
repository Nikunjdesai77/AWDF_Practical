require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const taskEvents = require('./events');
const { notificationLog } = require('./listeners'); // Registers event listeners!

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_practical10';

app.use(cors());
app.use(express.json());

// Request logger
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
    console.warn(`MongoDB connection error: ${err.message}`);
  });

// ==========================================
// 1. Root & Status
// ==========================================
app.get('/', (req, res) => {
  res.json({
    message: 'Practical 10: Asynchronous Processing with Event-Driven Architecture',
    eventEmitter: 'Active',
    endpoints: {
      getTasks: 'GET /tasks',
      createTask: 'POST /tasks (Emits task-created)',
      deleteTask: 'DELETE /tasks/:id (Emits task-deleted)',
      notifications: 'GET /notifications (View async background logs)',
      simulateError: 'POST /simulate-error (Tests error listener)'
    }
  });
});

// GET /notifications - Query background processed notifications
app.get('/notifications', (req, res) => {
  res.json({
    success: true,
    count: notificationLog.length,
    data: notificationLog
  });
});

// POST /simulate-error - Trigger error event test
app.post('/simulate-error', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Emitting test error event to verify error listener.'
  });
  taskEvents.emit('error', new Error('Simulated Background Listener Error'));
});

// ==========================================
// 2. Task Routes with Asynchronous EventEmitter
// ==========================================

// GET /tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
});

// POST /tasks - Create task and trigger asynchronous event
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Task title is required.'
      });
    }

    // 1. Save task to MongoDB
    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      completed: false
    });

    const responseTimestamp = new Date().toISOString();
    console.log(`[API RESPONSE SENT] Response 201 sent at ${responseTimestamp} for Task ID: ${newTask._id}`);

    // 2. Respond immediately to the client!
    res.status(201).json({
      success: true,
      message: 'Task created successfully. Background notification queued.',
      responseTimestamp,
      data: newTask
    });

    // 3. Emit event asynchronously AFTER response is sent (non-blocking)
    setImmediate(() => {
      taskEvents.emit('task-created', newTask);
    });

  } catch (error) {
    next(error);
  }
});

// DELETE /tasks/:id - Delete task and trigger task-deleted event
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid task ID format: '${id}'`
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${id}' not found.`
      });
    }

    const responseTimestamp = new Date().toISOString();
    console.log(`[API RESPONSE SENT] Delete Response 200 sent at ${responseTimestamp} for Task ID: ${id}`);

    // Respond immediately
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully. Deletion event emitted.',
      responseTimestamp,
      data: deletedTask
    });

    // Emit task-deleted event
    setImmediate(() => {
      taskEvents.emit('task-deleted', { id, title: deletedTask.title });
    });

  } catch (error) {
    next(error);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Practical 10 Server is running on http://localhost:${PORT}`);
    console.log(`Native EventEmitter initialized and listening for events.`);
    console.log(`MongoDB Target: ${MONGO_URI}`);
  });
}

module.exports = app;
