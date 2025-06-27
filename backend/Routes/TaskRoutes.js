const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createTask, getTasks, assignTask, getMyTasks } = require('../controllers/taskController');

router.post('/', auth, createTask);
router.get('/my-tasks', auth, getMyTasks);  
router.get('/', getTasks);
router.put('/:taskId/assign', auth, assignTask);

module.exports = router;
