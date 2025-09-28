const API_BASE = 'http://localhost:3001/api';

export class GameAPI {
  static async startGame(username: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE}/game/start/${username}/${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to start game');
    }

    return response.json();
  }

  static async makeGuess(gameId: string, guess: number[]): Promise<any> {
    const response = await fetch(`${API_BASE}/game/${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ geussing: guess }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to make guess');
    }

    return response.json();
  }

  static async getGameStatus(gameId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/game/${gameId}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to get game status');
    }

    return response.json();
  }

  static async endGame(gameId: string): Promise<string> {
    const response = await fetch(`${API_BASE}/game/${gameId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to end game');
    }

    return response.json();
  }
}