import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
const PlayerSchema = new mongoose.Schema({
    _id: ObjectId,
    name: String,
    password: String,
    mail: String,
    totalGames: {type:Number ,
      default:0}
      , 
    wins:{type:Number ,
      default:0}
      , 
  }
  );

export const PlayersCollection = mongoose.model('players', PlayerSchema);
