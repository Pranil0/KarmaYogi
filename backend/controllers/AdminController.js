const User = require('../models/UserModel');
const Task = require('../models/TaskModel');
const Offer = require('../models/OfferModel');
const Review = require('../models/ReviewModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('createdBy').populate('assignedTo');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate('taskId').populate('taskerId');
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching offers' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('taskId').populate('fromUserId').populate('toUserId');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};
