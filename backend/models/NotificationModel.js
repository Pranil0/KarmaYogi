// models/NotificationModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
  message: { type: String, required: true },
  type: { type: String }, // e.g., new-offer, offer-accepted, etc.
  read: { type: Boolean, default: false },
  link: { type: String }, // Optional: for redirection (e.g., /task/:id)
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
