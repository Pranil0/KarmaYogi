const Review = require('../models/ReviewModel');

exports.createReview = async (req, res) => {
  try {
    const review = new Review({ ...req.body, fromUserId: req.user.id });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error creating review' });
  }
};