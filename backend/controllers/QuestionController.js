const Question = require('../models/QuestionModel');

exports.askQuestion = async (req, res) => {
  const { taskId, text } = req.body;
  try {
    const question = await Question.create({
      task: taskId,
      text,
      createdBy: req.user.id,  // <== Use id instead of _id
    });
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to post question' });
  }
};



exports.getQuestionsForTask = async (req, res) => {
  try {
    const questions = await Question.find({ task: req.params.taskId })
      .populate('createdBy', 'name profile.avatar')
      .populate('answers.createdBy', 'name profile.avatar');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

exports.answerQuestion = async (req, res) => {
  const { text } = req.body;
  const questionId = req.params.id;
  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    question.answers.push({
      text,
      createdBy: req.user.id,
    });

    await question.save();
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post answer' });
  }
};
