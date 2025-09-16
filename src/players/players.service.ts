import { PlayersCollection } from './players.model';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { gameCollection } from '../game/game.model';
export default class Player_service
{
   static async createPlayer(name: string, password: string, mail?: string) {
  // מחכים לתוצאה של findPlayer
  const find_player = await Player_service.findPlayer(name, password);

  if (find_player != null) {
    return "player already exists"; // שים לב לתיקון באיות
  }

  const player = await PlayersCollection.create({
    _id: new mongoose.Types.ObjectId(),
    name: name,
    password: password,
    mail: mail, // אפשר להוסיף מייל במידת הצורך
    totalGames: 0,
    wins: 0,
  });

  return player.toJSON();
}


// * 2. חיפוש סל קיים לפי userId
// */
static async findPlayer(name: string, password: string) {
  try {
    const player = await PlayersCollection.findOne({ name, password }).lean();

    // אל תזרוק שגיאה — תחזיר null אם לא נמצא
    return player || null;

  } catch (error: any) {
    console.error("שגיאה בחיפוש שחקן:", error);
    return null;
  }
}


static async returnLastResult(playerId: mongoose.Types.ObjectId) {
    try {
  const player = await PlayersCollection.findById(playerId).lean();
  if (!player) throw new Error('player not found');

  const lastGame = await gameCollection.findOne({ playerId })
    .sort({ createdAt: -1 }) // ממיין לפי תאריך אחרון
    .lean();

  if (!lastGame) throw new Error('No game found for this player');

  return lastGame;
    }
    catch (error: any) {
    console.error(error);
    // טיפול בשגיאה אפשר להחזיר null או לזרוק מחדש
    return null; 
  }
}


static async getFastestWinsLeaderboardByAttempts() {
  // שלוף את כל המשחקים שניצחו בפחות מ-maxAttempts
  const winningGames = await gameCollection.find({
    winner: true
  }).lean().sort({maxattempt:1,creatAt:-1});
  return winningGames.slice(0, 10);
}
static async updatePlayer(playerId: mongoose.Types.ObjectId, player: any) {
  const updatedPlayer = await PlayersCollection.findByIdAndUpdate(
    playerId,
    { $set: player },
    { new: true }
  ).lean();

  return updatedPlayer;
}

static async getPlayerData(playerId: mongoose.Types.ObjectId) {
  const player = await PlayersCollection.findById(playerId).lean();
  if (!player) return "player not found";

  const games = await gameCollection.find({ playerId: playerId }).lean();

  return {
    player: player,
    games: games
  };
}



};
