import express, { Request, Response,NextFunction }  from 'express';
import {router} from './players/players.controller';
import {routerGame} from "./game/game.controller";

import {myDB} from './DB/connection';
const app = express();

app.use(express.json());
myDB.getDB();
// נתיבי ה-API
app.use('/api/players', router);
app.use('/api/game', routerGame);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Caught error:', err); // הדפס שגיאה בקונסול
  res.status(500).send('השתבש!');
});

export default app;