// routes/NotificationRoutes.js
const express = require('express');
const router = express.Router();

const {
  createNotification,
  getUserNotifications,
  markAsRead,
} = require('../controllers/NotificationController');

// POST /api/notifications
router.post('/', createNotification);

// GET /api/notifications/:userId
router.get('/:userId', getUserNotifications);

// PUT /api/notifications/:notificationId/read
router.put('/:notificationId/read', markAsRead);

module.exports = router;
