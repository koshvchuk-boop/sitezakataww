import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import DiscordStrategy from 'passport-discord';
import dotenv from 'dotenv';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import answerRoutes from './routes/answers.js';
import newsRoutes from './routes/news.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5000',
  // Add ngrok URLs if needed
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => origin.includes(allowed) || allowed.includes(origin))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Discord Strategy
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/api/auth/discord/callback',
      scope: ['identify', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Discord strategy callback - profile:', profile.username);
        
        let user = await User.findOne({ discordId: profile.id });
        
        if (user) {
          console.log('Discord user exists:', user.username);
          return done(null, user);
        }

        // Create new user from Discord profile
        console.log('Creating new Discord user:', profile.username);
        user = new User({
          username: profile.username,
          email: profile.email || `${profile.id}@discord.user`,
          discordId: profile.id,
          discordUsername: profile.username,
          discordAvatar: profile.avatar,
          role: 'user',
          status: 'approved', // Auto-approve Discord users
        });

        await user.save();
        console.log('New Discord user created:', user.username);
        done(null, user);
      } catch (error) {
        console.error('Discord strategy error:', error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/news', newsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coalition', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  console.log('🚀 Discord OAuth Configuration:');
  console.log('   - Discord Callback URL:', process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/api/auth/discord/callback');
  console.log('   - Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
})
.catch(err => console.error('❌ MongoDB error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
