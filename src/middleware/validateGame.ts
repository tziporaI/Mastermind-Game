import { Request, Response, NextFunction } from 'express';

export default function validategeussing(req: Request, res: Response, next: NextFunction): void {
  const geussing = req.body.geussing;
  console.log('Body:', req.body);

  if (!Array.isArray(geussing) || geussing.length !== 4) {
    res.status(400).json({ message: 'הניחוש חייב להיות מערך של 4 מספרים.' });
    return;
  }

  if (!geussing.every(num => typeof num === 'number' && Number.isInteger(num))) {
    res.status(400).json({ message: 'הניחוש חייב להכיל רק מספרים שלמים.' });
    return;
  }

  const unique = new Set(geussing);
  if (unique.size !== 4) {
    res.status(400).json({ message: 'כל מספר בניחוש חייב להופיע פעם אחת בלבד.' });
    return;
  }

  next();
}