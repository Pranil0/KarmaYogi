const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  offerAmount: {
    type: Number,
    required: true
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "withdrawn"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);
