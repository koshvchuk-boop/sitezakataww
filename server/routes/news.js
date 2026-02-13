import express from 'express';
import News from '../models/News.js';
import User from '../models/User.js';
import { verifyToken, verifyAdmin } from './auth.js';

const router = express.Router();

// Get all published news (public)
router.get('/', async (req, res) => {
  try {
    console.log('📰 Fetching all news');
    
    const news = await News.find({ isPublished: true })
      .populate('author', 'username discordUsername')
      .sort({ publishedAt: -1 })
      .limit(50);

    console.log('✅ Found', news.length, 'news articles');
    res.json(news);
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single news article
router.get('/:newsId', async (req, res) => {
  try {
    const news = await News.findById(req.params.newsId)
      .populate('author', 'username discordUsername');

    if (!news || !news.isPublished) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create news
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, content, imageUrl } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: 'Заполните все поля' });
    }

    console.log('📝 Admin creating news:', title);

    const news = new News({
      title,
      description,
      content,
      imageUrl: imageUrl || null,
      author: req.userId,
      isPublished: true,
      publishedAt: new Date(),
    });

    await news.save();
    await news.populate('author', 'username discordUsername');

    console.log('✅ News created:', news._id);
    res.status(201).json(news);
  } catch (error) {
    console.error('❌ Error creating news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update news
router.patch('/:newsId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, content, imageUrl, isPublished } = req.body;

    console.log('✏️ Admin updating news:', req.params.newsId);

    const news = await News.findByIdAndUpdate(
      req.params.newsId,
      {
        title,
        description,
        content,
        imageUrl,
        isPublished,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('author', 'username discordUsername');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    console.log('✅ News updated');
    res.json(news);
  } catch (error) {
    console.error('❌ Error updating news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete news
router.delete('/:newsId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('🗑️ Admin deleting news:', req.params.newsId);

    const news = await News.findByIdAndDelete(req.params.newsId);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    console.log('✅ News deleted');
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
