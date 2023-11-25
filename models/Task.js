const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedUser: { type: String },
  dueDate: { type: Date },
  completionStatus: { type: Boolean, default: false },
  completeAt: { type: Date },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;