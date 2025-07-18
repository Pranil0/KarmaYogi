const Offer = require('../models/OfferModel');
const Task = require('../models/TaskModel');
const {
  notifyNewOffer,
  notifyOfferAccepted,
} = require('./NotificationController');

// ✅ Create an offer
exports.createOffer = async (req, res) => {
  try {
    const { task, offerAmount, message } = req.body;

    const taskData = await Task.findById(task);
    if (!taskData) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (taskData.createdBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot make an offer on your own task.' });
    }

    const existingOffer = await Offer.findOne({ task, user: req.user.id });
    if (existingOffer) {
      return res.status(400).json({ message: 'You have already made an offer for this task.' });
    }

    const newOffer = new Offer({
      task,
      user: req.user.id,
      offerAmount,
      message
    });

    await newOffer.save();

    // 🔔 Notify poster
    await notifyNewOffer(newOffer);

    res.status(201).json(newOffer);
  } catch (err) {
    console.error('Error creating offer:', err);
    res.status(500).json({ message: 'Error creating offer' });
  }
};

// ✅ Get offers for a task
exports.getOffersForTask = async (req, res) => {
  try {
    const offers = await Offer.find({ task: req.params.taskId })
      .populate('user', 'name email profile.avatar');
    res.status(200).json(offers);
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({ message: 'Error fetching offers for this task' });
  }
};
// ✅ Get all offers made by the logged-in user (tasker dashboard)
exports.getMyOffers = async (req, res) => {
  try {
    const myOffers = await Offer.find({ user: req.user.id })
      .populate('task', 'title location budget dueDate status')
      .sort({ createdAt: -1 });

    res.status(200).json(myOffers);
  } catch (err) {
    console.error("Error fetching your offers:", err);
    res.status(500).json({ message: "Failed to fetch your offers." });
  }
};


// ✅ Accept an offer
exports.acceptOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId).populate('task');
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const task = await Task.findById(offer.task._id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to accept offer' });
    }

    if (task.status === 'assigned') {
      return res.status(400).json({ message: 'This task has already been assigned to another tasker.' });
    }

    task.assignedTo = offer.user;
    task.status = 'assigned';
    await task.save();

    offer.status = 'accepted';
    await offer.save();

    // 🔔 Notify accepted tasker
    await notifyOfferAccepted(offer);

    res.status(200).json({
      message: 'Offer accepted successfully and task assigned.',
      task,
    });
  } catch (err) {
    console.error('Error accepting offer:', err);
    res.status(500).json({ message: 'Server error while accepting offer' });
  }
};
// ✅ Get single offer by ID with task populated — for MyOfferDetail page
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId)
      .populate('task', 'title location budget dueDate status createdBy')
      .populate('user', 'name avatar email');

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Authorization: only offer owner can view this offer
    if (offer.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this offer.' });
    }

    res.status(200).json(offer);
  } catch (err) {
    console.error('Error fetching offer:', err);
    res.status(500).json({ message: 'Server error fetching offer' });
  }
};
