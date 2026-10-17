const EventEmitter = require('events');

/**
 * Dedicated EventEmitter instance for task lifecycle events
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 */
class TaskEvents extends EventEmitter {}

module.exports = new TaskEvents();
