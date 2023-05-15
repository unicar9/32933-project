import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.body.userId = (decoded as any).userId;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
