import express from 'express';
import Answer from '../models/Answer.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Submit answer to question
router.post('/', verifyToken, async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    // Check if user already answered this question
    const existingAnswer = await Answer.findOne({
      questionId,
      userId: req.userId,
    });

    if (existingAnswer) {
      return res.status(400).json({ message: 'You already answered this question' });
    }

    const newAnswer = new Answer({
      questionId,
      userId: req.userId,
      answer,
    });

    await newAnswer.save();
    await newAnswer.populate('userId', 'username email');

    res.status(201).json({
      message: 'Answer submitted successfully',
      answer: newAnswer,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's answers
router.get('/user/my-answers', verifyToken, async (req, res) => {
  try {
    const answers = await Answer.find({ userId: req.userId })
      .populate('questionId');
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get answers for specific question (user can only see their own)
router.get('/question/:questionId', verifyToken, async (req, res) => {
  try {
    const answer = await Answer.findOne({
      questionId: req.params.questionId,
      userId: req.userId,
    }).populate('questionId');

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
