import React, { useState, useEffect, useRef } from 'react';
import { Target, RotateCcw, LogOut, Trophy, AlertCircle } from 'lucide-react';

interface GameBoardProps {
  gameId: string;
  onLogout: () => void;
  onNewGame: () => void;
}

interface Attempt {
  guess: number[];
  bulls: number;
  pgias: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameId, onLogout, onNewGame }) => {
  const [guess, setGuess] = useState<string[]>(['', '', '', '']);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [gameStatus, setGameStatus] = useState<'active' | 'won' | 'lost' | 'ended'>('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(10);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && (!/^\d$/.test(value) || guess.includes(value))) return;

    const newGuess = [...guess];
    newGuess[index] = value;
    setGuess(newGuess);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !guess[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const makeGuess = async () => {
    if (guess.some(g => !g) || new Set(guess).size !== 4) return;

    setLoading(true);
    setError(null);

    try {
      const guessNumbers = guess.map(Number);
      const response = await fetch(`http://localhost:3001/api/game/${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geussing: guessNumbers }),
      });

      if (!response.ok) throw new Error('Failed to make guess');

      const result = await response.json();
      
      if (typeof result === 'string') {
        // Game ended
        if (result.includes('winnnnnnnnnnnnnnn')) {
          setGameStatus('won');
        } else if (result.includes('lost')) {
          setGameStatus('lost');
        }
      } else {
        // Continue playing
        const newAttempt: Attempt = {
          guess: guessNumbers,
          bulls: result.bulls,
          pgias: result.pgias,
        };
        setAttempts(prev => [...prev, newAttempt]);
        setRemainingAttempts(prev => prev - 1);
        
        if (result.bulls === 4) {
          setGameStatus('won');
        }
      }

      setGuess(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בביצוע הניחוש');
    } finally {
      setLoading(false);
    }
  };

  const isValidGuess = guess.every(g => g !== '') && new Set(guess).size === 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">בול פגיעה</h1>
                <p className="text-gray-600">ניסיונות נותרים: {remainingAttempts}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onNewGame}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                משחק חדש
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                יציאה
              </button>
            </div>
          </div>
        </div>

        {/* Game Status */}
        {gameStatus === 'won' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-green-800">מזל טוב! ניצחת!</h2>
                <p className="text-green-600">פיצחת את הקוד ב-{attempts.length} ניסיונות</p>
              </div>
            </div>
          </div>
        )}

        {gameStatus === 'lost' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <h2 className="text-xl font-bold text-red-800">המשחק הסתיים</h2>
                <p className="text-red-600">לא הצלחת לפצח את הקוד</p>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        {gameStatus === 'active' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-right">הכנס את הניחוש שלך</h2>
            <div className="flex gap-3 justify-center mb-4">
              {guess.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                  maxLength={1}
                  disabled={loading}
                />
              ))}
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm text-right">{error}</p>
              </div>
            )}

            <button
              onClick={makeGuess}
              disabled={!isValidGuess || loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'מנחש...' : 'שלח ניחוש'}
            </button>
            
            <p className="text-sm text-gray-600 mt-3 text-right">
              הכנס 4 ספרות שונות (1-9)
            </p>
          </div>
        )}

        {/* Attempts History */}
        {attempts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-right">היסטוריית ניחושים</h2>
            <div className="space-y-3">
              {attempts.map((attempt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      בול: {attempt.bulls}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      פגיעה: {attempt.pgias}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {attempt.guess.map((digit, i) => (
                      <span key={i} className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center font-mono font-bold">
                        {digit}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">#{attempts.length - index}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};