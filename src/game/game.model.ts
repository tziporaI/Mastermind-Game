// import mongoose, { Document, Schema } from 'mongoose';
// import { ObjectId } from 'mongodb';
// const gameSchema = new mongoose.Schema(
// {
//     _id: ObjectId,          // מזהה המשחק
//     playerId:  ObjectId,          // מזהה השחקן
//     secretCode: Number[4],         // למשל: [4, 2, 8, 1]
//     attempts: [
//       {
//         guess: Number[4],          // למשל: [4, 3, 2, 9]
//         bulls: Number,          // מספר ה-bulls
//         pgias: Number,           // מספר ה-pigs
//         createdAt: Date
//       }
//     ],
//     status:{type:String
    
//       , enum: ['active', 'finished', 'abandoned']
//     },
//     maxAttempts: Number,
//     winner: Boolean,              // האם הצליח לנחש
//     createdAt: Date
//   }
  
// );

// export const Game = mongoose.model('game', gameSchema);
import mongoose, { Schema, Document,ObjectId } from 'mongoose';
const attemptSchema = new Schema({
  guess: {
    type: [Number],
    validate: [(arr: Number[]) => arr.length === 4, '{PATH} must have length 4'], // enforce length 4
    required: true,
  },
  bulls: { type: Number, required: true },
  pgias: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const gameSchema = new Schema(
  {
    playerId: { type:mongoose.Types.ObjectId, required: true },
    secretCode: {
      type: [Number],
      validate: [(arr: Number[]) => arr.length === 4, '{PATH} must have length 4'],
      required: true,
    },
    attempts: [attemptSchema],
    status: {
      type: String,
      enum: ['active','in-progress',  'won'  ,'lost' ,'ended',],
      default: 'active'
    },
    maxAttempts: { type: Number, required: true },
    winner: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }
);

 export  const gameCollection = mongoose.model('Game', gameSchema);