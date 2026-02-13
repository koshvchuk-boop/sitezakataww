import express from 'express';
import Answer from '../models/Answer.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import { verifyToken, verifyAdmin } from './auth.js';

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

// User: Check if all questions answered
router.get('/check-completion', verifyToken, async (req, res) => {
  try {
    const questions = await Question.find();
    const answers = await Answer.find({ userId: req.userId });
    
    console.log('✅ Check completion for user:', req.userId);
    console.log('📊 Questions:', questions.length, 'Answers:', answers.length);
    
    const allAnswered = answers.length === questions.length;
    const existingTicket = await Ticket.findOne({ userId: req.userId });
    
    // User can submit if:
    // 1. All answered AND
    // 2. (No ticket exists OR previous ticket was rejected)
    const canSubmit = allAnswered && (!existingTicket || existingTicket.status !== 'pending');
    const hasTicket = !!existingTicket;

    console.log('🎫 Ticket status:', existingTicket?.status, 'canSubmit:', canSubmit);

    res.json({
      totalQuestions: questions.length,
      answeredQuestions: answers.length,
      allAnswered,
      canSubmit,
      hasTicket,
      ticketStatus: existingTicket?.status || null,
    });
  } catch (error) {
    console.error('❌ Error checking completion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Submit all answers as a ticket
router.post('/submit-ticket', verifyToken, async (req, res) => {
  try {
    console.log('🎫 User', req.userId, 'submitting ticket');
    
    // Get all questions
    const questions = await Question.find();
    
    // Get all answers from user
    const answers = await Answer.find({ userId: req.userId })
      .populate('questionId');
    
    // Check if answered all questions
    if (answers.length !== questions.length) {
      return res.status(400).json({ 
        message: `Ответьте на все ${questions.length} вопросов` 
      });
    }

    // Check if ticket already exists
    const existingTicket = await Ticket.findOne({ userId: req.userId });
    if (existingTicket && existingTicket.status === 'pending') {
      return res.status(400).json({ message: 'У вас уже есть открытый тикет' });
    }

    // If previous ticket was rejected - delete it to allow new submission
    if (existingTicket && existingTicket.status === 'rejected') {
      await Ticket.findByIdAndDelete(existingTicket._id);
      console.log('🗑️ Deleted previous rejected ticket');
    }

    // Create ticket with all answers
    const ticketData = {
      userId: req.userId,
      answers: answers.map(a => ({
        questionId: a.questionId._id,
        answer: a.answer,
      })),
      status: 'pending',
    };

    const ticket = new Ticket(ticketData);
    await ticket.save();
    
    // Update user status
    await User.findByIdAndUpdate(req.userId, { status: 'pending' });

    console.log('✅ Ticket created:', ticket._id);
    res.status(201).json({ 
      message: 'Тикет успешно отправлен на проверку',
      ticket 
    });
  } catch (error) {
    console.error('❌ Error submitting ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all tickets
router.get('/admin/tickets', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('🎫 Admin fetching all tickets');
    
    const tickets = await Ticket.find()
      .populate('userId', 'username email discordUsername')
      .populate('answers.questionId', 'title')
      .sort({ createdAt: -1 });

    console.log('✅ Found', tickets.length, 'tickets');
    res.json(tickets);
  } catch (error) {
    console.error('❌ Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get ticket details
router.get('/admin/ticket/:ticketId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('🎫 Admin viewing ticket:', req.params.ticketId);
    
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate('userId', 'username email discordUsername')
      .populate('answers.questionId', 'title description');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('❌ Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Review ticket (approve/reject)
router.patch('/admin/ticket/:ticketId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    console.log('🎫 Admin reviewing ticket:', req.params.ticketId, 'Status:', status);
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Update ticket
    ticket.status = status;
    ticket.reviewedAt = new Date();
    ticket.reviewedBy = req.userId;
    await ticket.save();

    // Update user status
    const user = await User.findByIdAndUpdate(
      ticket.userId,
      { status },
      { new: true }
    );

    // If rejected - delete all answers
    if (status === 'rejected') {
      await Answer.deleteMany({ userId: ticket.userId });
      console.log('🗑️ Deleted all answers for user:', ticket.userId);
    }

    console.log('✅ Ticket', status);
    res.json({ 
      message: `Тикет ${status === 'approved' ? 'одобрен' : 'отклонен'}`,
      ticket,
      user
    });
  } catch (error) {
    console.error('❌ Error reviewing ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete ticket
router.delete('/admin/ticket/:ticketId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('🗑️ Admin deleting ticket:', req.params.ticketId);
    
    const ticket = await Ticket.findByIdAndDelete(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Reset user status
    await User.findByIdAndUpdate(ticket.userId, { status: 'pending' });

    console.log('✅ Ticket deleted');
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

// Debug endpoints (development only)
if (process.env.NODE_ENV !== 'production') {
  router.get('/debug/questions', async (req, res) => {
    try {
      const questions = await Question.find();
      const answers = await Answer.find();
      const tickets = await Ticket.find();
      res.json({
        questions: {
          count: questions.length,
          data: questions.map(q => ({ _id: q._id, title: q.title }))
        },
        answers: {
          count: answers.length,
          byUser: answers.length > 0 ? answers[0].userId : null
        },
        tickets: {
          count: tickets.length,
          data: tickets.map(t => ({ _id: t._id, status: t.status }))
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Test endpoint - create ticket for first user with answers
  router.post('/debug/create-test-ticket', async (req, res) => {
    try {
      const answers = await Answer.find().populate('questionId');
      if (answers.length === 0) {
        return res.status(400).json({ error: 'No answers found' });
      }

      const userId = answers[0].userId;
      console.log('🎫 Creating test ticket for user:', userId);

      // Get all questions
      const questions = await Question.find();
      
      // Get all answers from user
      const userAnswers = await Answer.find({ userId }).populate('questionId');
      
      if (userAnswers.length !== questions.length) {
        return res.status(400).json({ 
          error: `User answered ${userAnswers.length} questions, but ${questions.length} are required`
        });
      }

      // Create ticket
      const ticketData = {
        userId,
        answers: userAnswers.map(a => ({
          questionId: a.questionId._id,
          answer: a.answer,
        })),
        status: 'pending',
      };

      const ticket = new Ticket(ticketData);
      await ticket.save();
      
      // Update user status
      await User.findByIdAndUpdate(userId, { status: 'pending' });

      console.log('✅ Test ticket created:', ticket._id);
      res.json({ 
        success: true,
        ticketId: ticket._id,
        userId,
        message: 'Test ticket created successfully'
      });
    } catch (error) {
      console.error('❌ Error creating test ticket:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Debug - clear all tickets
  router.post('/debug/clear-tickets', async (req, res) => {
    try {
      await Ticket.deleteMany({});
      await User.updateMany({}, { status: 'pending' });
      console.log('🗑️ All tickets cleared');
      res.json({ success: true, message: 'All tickets deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Debug - clear all answers
  router.post('/debug/clear-answers', async (req, res) => {
    try {
      await Answer.deleteMany({});
      console.log('🗑️ All answers cleared');
      res.json({ success: true, message: 'All answers deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
