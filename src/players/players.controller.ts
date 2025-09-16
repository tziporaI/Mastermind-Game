import { Router, Request, Response } from 'express';
import {PlayersCollection} from './players.model';
import Player_service from './players.service';  
import mongoose from 'mongoose';
import  validatePlayerFields  from '../middleware/validateParameters';
export const router = Router();

//יצירת שחקן חדש
router.post('/add', validatePlayerFields, async (req, res) => {
  try {
    const player = await Player_service.createPlayer(req.body.name, req.body.password, req.body.email);

    if (typeof player === 'string') {
      res.status(409).send(player);
      return;  // מחזירים כדי לעצור את הריצה, אבל לא מחזירים את res
    }

    res.status(201).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


//החזרת המשחק האחרון ששוחק
router.get('/:playerid/recent', async (req, res) => {
    const id=new mongoose.Types.ObjectId(req.params.playerid);
     const result=Player_service.returnLastResult(id);
    res.json(result);
});
//קבלת 10 השחקנים המנצחים 
router.get('/leaderboard', async (req, res) => {
    const users = await Player_service.getFastestWinsLeaderboardByAttempts();
    res.send(users);
});
//עריכת שחקן
router.put('/:playerid', async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.playerid);
    const details = req.body;
    const updatedUser = await Player_service.updatePlayer(id, details);

    if (!updatedUser) {
       res.status(404).send('Player not found');
       return;
    }

    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

//מחיקת שחקן
router.delete('/:playerid', async (req, res) => {
    const id =new mongoose.Types.ObjectId(req.params.playerid);   
    const player = await PlayersCollection.findOneAndDelete( id );

    res.send(player);
});
//קבלת מידע על המשתמש
router.get('/:playerid', async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.playerid);
    const AllDatasPlayer = await Player_service.getPlayerData(id);

    if (typeof AllDatasPlayer === 'string') {
       res.status(404).send(AllDatasPlayer);
       return;
    }

    res.send(AllDatasPlayer);
  } catch (error) {
    next(error); // שולח את השגיאה ל־error middleware
  }
});
