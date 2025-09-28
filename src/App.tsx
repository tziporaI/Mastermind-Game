import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { GameBoard } from './components/GameBoard';
import { GameAPI } from './services/api';

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const newGameId = await GameAPI.startGame(username, password);
      setGameId(newGameId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setGameId(null);
    setError(null);
  };

  const handleNewGame = () => {
    setGameId(null);
    setError(null);
  };

  if (gameId) {
    return (
      <GameBoard
        gameId={gameId}
        onLogout={handleLogout}
        onNewGame={handleNewGame}
      />
    );
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      loading={loading}
      error={error}
    />
  );
}

export default App;