import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    console.log('✅ Token verified for user:', decoded.id);
    next();
  } catch (error) {
    console.log('❌ Invalid token');
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    console.log('🔐 Admin check for user:', user?.username, '- role:', user?.role);
    
    if (user?.role !== 'admin') {
      console.log('❌ User is not admin');
      return res.status(403).json({ message: 'Admin access required' });
    }
    console.log('✅ Admin access granted');
    next();
  } catch (error) {
    console.log('❌ Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        discordId: user.discordId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Discord OAuth
router.get('/discord', (req, res, next) => {
  console.log('🔗 Discord OAuth start');
  passport.authenticate('discord')(req, res, next);
});

router.get('/discord/callback', passport.authenticate('discord', { 
  failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed` 
}), (req, res) => {
  try {
    if (!req.user) {
      console.error('❌ Discord callback: req.user is undefined');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_user`);
    }

    // Create JWT token for authenticated user
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    console.log('✅ Discord OAuth successful for:', req.user.username);
    console.log('🔐 Generated token:', token.substring(0, 20) + '...');

    // Redirect to frontend with token in query - frontend will handle storing it
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/?oauth_token=${token}`;
    console.log('🔄 Redirecting to:', redirectUrl);
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ Discord callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
  }
});

export default router;
