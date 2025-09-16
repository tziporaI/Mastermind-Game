
import mongoose, { ObjectId } from 'mongoose';
import { gameCollection } from './game.model';
import Logic_game from './game.logic';

export default class Game_service
{
  /**
   * 1. יצירת משחק חדש למשתמש
   */
  static async createNewGame(playerId:mongoose.Types.ObjectId) {
 
    const secretCode =await Logic_game.generateSecretCode();
    const newGame = await gameCollection.create({
      _id: new mongoose.Types.ObjectId(),
      playerId: playerId, 
      secretCode:secretCode,
      attempts: [
        {
          guess: [0,0,0,0],          
          bulls: 0,          
          pgias: 0
        }
      ],
      maxAttempts: 10,
      winner: false,
      createdAt: new Date().getDate()
    });
    return newGame;
  }
  /**
   * 2. חיפוש סל קיים לפי PlayerId
   */
  static async  getGame(playerId:mongoose.Types.ObjectId)  {
    const game= await gameCollection.findOne({ playerId }).lean();
    return game;  
  }
 /**
   * 3. ניסיון לנחש...
   */
static async tryGeuss(
  gameId: mongoose.Types.ObjectId,
  geussing: number[]
) {
  const game = await gameCollection.findById(gameId);
  if (!game) throw new Error('game not found');

  const result = Logic_game.Bool_Pgia(geussing, game.secretCode);

  game.attempts.push({
    guess: geussing,
    bulls: result.bulls,
    pgias: result.pgias,
    createdAt: new Date(),
  });

  game.status = 'in-progress';

  if (result.bulls === 4 && result.pgias === 0) {
    game.status = 'won';
    game.winner = true;
    await game.save();
    return Logic_game.WinGame(gameId);
  }

  if (game.attempts.length >= game.maxAttempts) {
    game.status = 'lost';
    await game.save();
    return Logic_game.lostGame(gameId);
  }

  await game.save();
  return result;
}

/**
   * 4. קבלת הסטטוס
*/
 static async getStatusGame(gameId:mongoose.Types.ObjectId) {
  const game = await gameCollection.findOne({ _id: gameId }).lean();
  if (!game) throw new Error('game not found');

  const lastAttempt = game.attempts && game.attempts.length > 0
    ? game.attempts[game.attempts.length - 1]
    : null;

  return {
    status: game.status,
    bulls: lastAttempt ? lastAttempt.bulls : null,
    pgias: lastAttempt ? lastAttempt.pgias : null,
  };

}
  /**
   * 5. הוספת מוצר לסל (אם קיים, מגדילים כמות, אחרת מוסיפים חדש)
   */
  static async  endGame(gameId:mongoose.Types.ObjectId) {
    const game = await gameCollection.findOne({ _id: gameId });
    if (!game) 
      throw new Error('game not found');
    game.status="ended";
   await game.save();
    return "your game come to end";
    }
}
