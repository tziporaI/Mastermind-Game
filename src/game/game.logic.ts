import e from 'express';
import Game_service from './game.service';
import  Player_service  from '../players/players.service';
import { PlayersCollection } from '../players/players.model';
import mongoose, { ObjectId } from 'mongoose';
import { gameCollection } from './game.model';
export default class Logic_game
{
static async IsExist(name: string, password: string): Promise<any | string> {
  let player: any;
  try {
    player = await Player_service.findPlayer(name, password);
  } catch {
    player = await Player_service.createPlayer(name, password);
  }

  // חיפוש משחק פעיל
  let game = await this.getActiveGame(player._id);
  if (!game) {
    game = await Game_service.createNewGame(player._id);
    player.totalGames = player.totalGames + 1;
    await PlayersCollection.updateOne(
      { _id: player._id },
      { $set: { totalGames: player.totalGames } }
    );
  }

  return game;
}
static async getActiveGame(playerId: mongoose.Types.ObjectId) {
  const activeGame = await gameCollection.findOne({ playerId, status: { $in: ['active', 'in-progress'] } });
  return activeGame;
}

  static Bool_Pgia(geussing:Number[],secretCode: Number[]){
      let bulls = 0, pgias = 0;
      const codeCopy = [...secretCode];
      const guessCopy = [...geussing];
  
      for (let i = 0; i < 4; i++) {
        if (guessCopy[i] === codeCopy[i]) {
          bulls++;
          codeCopy[i] = guessCopy[i] = null as any;
        }
      }
      for (let i = 0; i < 4; i++) {
        if (guessCopy[i] !== null && codeCopy.includes(guessCopy[i])) {
          pgias++;
          codeCopy[codeCopy.indexOf(guessCopy[i])] = null as any;
        }
      }
      return { bulls, pgias };
    }
  
    static async  WinGame(gameId:mongoose.Types.ObjectId) {
      const game = await gameCollection.findOne({ _id: gameId });
      if (!game) 
        throw new Error('game not found');
      game.status="won";
      game.winner=true;
     game.createdAt=new Date();
           await game.save();
      return "your winnnnnnnnnnnnnnn";
      }
      static async  lostGame(gameId:mongoose.Types.ObjectId) {
        const game = await gameCollection.findOne({ _id: gameId });
        if (!game) 
          throw new Error('game not found');
        game.status='lost';
        game.winner=false;
       game.createdAt=new Date();
             await game.save();
        return "your lost the game";
        }

static async generateSecretCode() {
  const digits: Number[] = [];
  while (digits.length < 4) {
    const rand = Math.floor(Math.random() * 10); // מספר אקראי בין 0 ל-9
    if (!digits.includes(rand)) {
      digits.push(rand);
    }
  }
  return digits;
}
};
