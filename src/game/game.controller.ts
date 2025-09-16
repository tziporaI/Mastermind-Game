import { Router, Request, Response } from 'express';
import Game_service from './game.service';
import Logic_game from './game.logic';
import mongoose, { ObjectId } from 'mongoose';
import validatePlayerFields  from '../middleware/validateParameters';
import validateGuess from '../middleware/validateGame';

export const routerGame = Router();
routerGame.get('/test', (req, res) => {
  res.send('Game route works');
});


// יצירת משחק חדש
routerGame.post('/start/:userId/:password', validatePlayerFields, async (req: Request, res: Response) => {
  console.log('BODY:', req.body);

  try {
    const newGame = await Logic_game.IsExist(req.params.userId, req.params.password);

    if (!newGame) {
       res.status(404).send('player was not added');
       return;
    }

    res.status(200).json(newGame._id);
  } catch (error) {
    console.error('שגיאה ב-start route:', error);
    res.status(500).send('משהו השתבש');
  }
});
// ניוחש משחק   
routerGame.post('/:gameId', validateGuess, async (req: Request, res: Response) => {
  const game_id = new mongoose.Types.ObjectId(req.params.gameId);
  const geussing: number[] = req.body.geussing;
  const bool_pgiah = await Game_service.tryGeuss(game_id, geussing);
  res.json(bool_pgiah); // זה מצוין! לא צריך return
});
//קבלת סטטוס
routerGame.get('/:gameId',async (req : Request, res : Response) => {
  const id=new mongoose.Types.ObjectId(req.params.gameId);
  const game = await Game_service.getStatusGame(id);
  if (!game) {
    res.status(404).send('game not found');
    return;
  }
     
     res.status(200).json(game);
  });
  // גמירת המשחק באופן לא צפוי
routerGame.post('/:gameId/end', async (req: Request, res: Response) => {
  const game_id = new mongoose.Types.ObjectId(req.params.gameId);
 
  const massage = await Game_service.endGame(game_id);
  res.json(massage);
});


