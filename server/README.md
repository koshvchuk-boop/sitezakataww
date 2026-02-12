# Coalition Server Documentation

This is the backend server for the Discord/Minecraft Coalition website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure your environment variables:
   - MongoDB connection URI
   - Discord OAuth credentials (from https://discord.com/developers/applications)
   - JWT secret

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions (Admin)
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question with answers
- `POST /api/questions` - Create question (admin only)
- `PUT /api/questions/:id` - Update question (admin only)
- `DELETE /api/questions/:id` - Delete question (admin only)

### Answers
- `POST /api/answers` - Submit answer
- `GET /api/answers/user/my-answers` - Get user's answers
- `GET /api/answers/question/:questionId` - Get user's answer to specific question

## Database Models

- User - User accounts (username, email, password/Discord)
- Question - Questionnaire questions (created by admins)
- Answer - User answers to questions
