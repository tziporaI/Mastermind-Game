# Bulls and Cows Game - React Frontend

A modern React frontend for the Bulls and Cows (בול פגיעה) game, built with TypeScript and Tailwind CSS.

## Features

- **User Authentication**: Login and registration with validation
- **Game Interface**: Intuitive game board with real-time feedback
- **Attempt History**: Track all your guesses and results
- **Responsive Design**: Works perfectly on desktop and mobile
- **RTL Support**: Full Hebrew language support
- **Modern UI**: Clean, professional design with smooth animations

## Game Rules

- Guess a 4-digit secret code
- Each digit must be unique (1-9)
- **Bull**: Correct digit in correct position
- **Pgia**: Correct digit in wrong position
- You have 10 attempts to guess the code

## API Integration

The frontend connects to your Node.js backend with the following endpoints:

### Game Endpoints
- `POST /api/game/start/:userId/:password` - Start new game
- `POST /api/game/:gameId` - Make a guess
- `GET /api/game/:gameId` - Get game status
- `POST /api/game/:gameId/end` - End game early

### Player Endpoints
- `POST /api/players/add` - Register new player
- `GET /api/players/:playerId` - Get player data
- `GET /api/players/leaderboard` - Get top players

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Make sure your backend is running on port 3001**

4. **Open your browser** and navigate to the development server URL

## Project Structure

```
src/
├── components/
│   ├── LoginForm.tsx      # User authentication
│   └── GameBoard.tsx      # Main game interface
├── services/
│   └── api.ts            # API integration
├── types/
│   └── game.ts           # TypeScript interfaces
├── App.tsx               # Main application component
└── index.css             # Global styles
```

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

## Features Implemented

✅ User login and registration
✅ Game creation and management
✅ Real-time guess validation
✅ Attempt history tracking
✅ Game status updates
✅ Responsive design
✅ Hebrew RTL support
✅ Error handling
✅ Loading states
✅ Modern UI/UX

## Backend Compatibility

This frontend is designed to work with your existing Node.js backend that includes:
- MongoDB with Mongoose
- Express.js with TypeScript
- Player and Game models
- Validation middleware
- Bulls and Cows game logic

Make sure your backend server is running on `http://localhost:3001` for the API calls to work properly.