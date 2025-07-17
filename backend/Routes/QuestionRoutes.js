const express = require('express');
const {
  askQuestion,
  getQuestionsForTask,
  answerQuestion,
} = require('../controllers/QuestionController');
const auth = require('../middleware/auth');





const router = express.Router();

router.post('/', auth, askQuestion); // Ask a question
router.get('/task/:taskId', getQuestionsForTask); // Get all questions for a task
router.put('/:id/answer', auth, answerQuestion); // Answer a question

module.exports = router;
