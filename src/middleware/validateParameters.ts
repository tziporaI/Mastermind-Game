import validator from 'validator';
import { Request, Response, NextFunction } from 'express';

export default function validatePlayerFields(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { mail, name, password } = req.body||{};
  const { userId, password:paramPassword } = req.params;
  const effectivePassword = password || paramPassword;
  const effectiveName = name || userId;

  // אם קיים מייל - נבדוק שהוא תקין
  if (mail && !validator.isEmail(mail)) {
    res.status(400).json({ message: 'מייל לא תקין' });
    return;
  }

  // אם אין מייל - חובה שיהיה name
  if (!mail && (!effectiveName || typeof effectiveName !== 'string')) {
    res.status(400).json({ message: 'יש לספק שם משתמש או מייל' });
    return;
  }

  // בדיקת סיסמה
 if (
  !effectivePassword ||
  typeof effectivePassword !== 'string' ||
  (typeof effectivePassword === 'string' && effectivePassword.length < 6)
) {
  res.status(400).json({ message: 'סיסמה חייבת להיות באורך 6 תווים לפחות' });
  return;
}


  next();
}
