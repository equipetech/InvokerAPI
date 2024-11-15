import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    (req as any).user = decoded; 
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};