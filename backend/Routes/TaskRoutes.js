const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createTask,
  getTasks,
  getFeaturedTasks,
  assignTask,
  getMyTasks,
  getTaskById,
  updateTask,
  cancelTask
} = require('../controllers/TaskController');

// ✅ Public: Featured Gigs
router.get('/featured', getFeaturedTasks);

// ✅ Public: All tasks
router.get('/', getTasks);

// ✅ Auth: My tasks
router.get('/my-tasks', auth, getMyTasks);

// ✅ Auth: Create
router.post('/', auth, createTask);

// ✅ Auth: Assign
router.put('/:taskId/assign', auth, assignTask);

// ✅ Auth: Cancel
router.put('/:taskId/cancel', auth, cancelTask);

// ✅ Auth: Update
router.put('/:id', auth, updateTask);

// ✅ Auth: Get by ID — put this LAST
router.get('/:id', auth, getTaskById);

module.exports = router;
