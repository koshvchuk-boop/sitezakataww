import express from 'express';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import { verifyToken, verifyAdmin } from './auth.js';

const router = express.Router();

// Get all active questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true })
      .populate('createdBy', 'username')
      .sort({ order: 1 });
    console.log('📋 Fetched', questions.length, 'active questions');
    res.json(questions);
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single question with answers (admin only)
router.get('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('📝 Admin requesting question:', req.params.id);
    
    const question = await Question.findById(req.params.id).populate('createdBy', 'username');
    
    if (!question) {
      console.log('❌ Question not found:', req.params.id);
      return res.status(404).json({ message: 'Question not found' });
    }

    // Get all answers for this question (only admin can see all)
    const answers = await Answer.find({ questionId: question._id })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    console.log('✅ Found', answers.length, 'answers for question:', question.title);
    
    // Log first answer for debugging
    if (answers.length > 0) {
      console.log('   - First answer:', answers[0].userId.username, '-', answers[0].answer);
    }

    res.json({
      question,
      answers,
    });
  } catch (error) {
    console.error('❌ Error fetching question with answers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create question (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;

    const question = new Question({
      title,
      description,
      createdBy: req.userId,
    });

    await question.save();
    await question.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Question created',
      question,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update question (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { title, description, isActive },
      { new: true }
    ).populate('createdBy', 'username');

    res.json({
      message: 'Question updated',
      question,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete question (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reorder questions (admin only)
router.patch('/reorder/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { direction } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (direction === 'up') {
      question.order -= 1;
    } else if (direction === 'down') {
      question.order += 1;
    }

    await question.save();
    res.json({ message: 'Question reordered', question });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
