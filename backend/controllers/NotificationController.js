// controllers/NotificationController.js
const Notification = require('../models/NotificationModel');
const Offer = require('../models/OfferModel');
const Task = require('../models/TaskModel');

// 🔔 Create generic notification (for manual testing or admin use)
exports.createNotification = async (req, res) => {
  try {
    const { user, message, type, link } = req.body;
    const notification = new Notification({ user, message, type, link });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// 🔔 Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// 🔔 Mark as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

// ✅ Triggered: Tasker makes an offer → Notify Poster
exports.notifyNewOffer = async (offer) => {
  const task = await Task.findById(offer.task).populate('createdBy');
  if (!task) return;

  const message = `New offer received on your task "${task.title}".`;
  await Notification.create({
    user: task.createdBy._id,
    message,
    type: 'new-offer',
    link: `/task/${task._id}`,
  });
};

// ✅ Triggered: Poster accepts an offer → Notify Tasker
exports.notifyOfferAccepted = async (offer) => {
  const task = await Task.findById(offer.task);
  if (!task) return;

  const message = `Your offer for task "${task.title}" has been accepted.`;
  await Notification.create({
    user: offer.user,
    message,
    type: 'offer-accepted',
    link: `/task/${task._id}`,
  });
};

// ✅ Triggered: Task edited → Notify all offerers
exports.notifyTaskEdited = async (taskId) => {
  const offers = await Offer.find({ task: taskId }).populate('user');
  const task = await Task.findById(taskId);
  if (!task) return;

  for (const offer of offers) {
    await Notification.create({
      user: offer.user._id,
      message: `Task "${task.title}" has been updated by the poster.`,
      type: 'task-edited',
      link: `/task/${task._id}`,
    });
  }
};



exports.notifyTaskCanceled = async (taskId) => {
  try {
    const task = await Task.findById(taskId);
    if (!task) return;

    const offers = await Offer.find({ task: taskId });
    const acceptedOffer = await Offer.findOne({ task: taskId, status: 'accepted' });

    for (const offer of offers) {
      const isAccepted = acceptedOffer && offer._id.toString() === acceptedOffer._id.toString();

      const message = isAccepted
        ? `The task you accepted "${task.title}" was cancelled by the poster.`
        : `Task "${task.title}" has been cancelled by the poster.`;

      await Notification.create({
        user: offer.user,
        message,
        type: 'task-cancelled',
        link: `/task/${task._id}`,
      });
    }
  } catch (err) {
    console.error('Error notifying task cancellation:', err);
  }
};

