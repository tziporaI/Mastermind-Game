export interface Player {
  _id: string;
  name: string;
  password: string;
  mail?: string;
  totalGames: number;
  wins: number;
}

export interface GameAttempt {
  guess: number[];
  bulls: number;
  pgias: number;
  createdAt: string;
}

export interface Game {
  _id: string;
  playerId: string;
  secretCode: number[];
  attempts: GameAttempt[];
  status: 'active' | 'in-progress' | 'won' | 'lost' | 'ended';
  maxAttempts: number;
  winner: boolean;
  createdAt: string;
}

export interface GameStatus {
  status: string;
  bulls: number | null;
  pgias: number | null;
}

export interface GuessResult {
  bulls: number;
  pgias: number;
}