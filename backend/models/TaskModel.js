const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  location: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  budget: { type: Number, required: true },
  dueDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isCancelled: { type: Boolean, default: false }, 
  status: { type: String, default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
