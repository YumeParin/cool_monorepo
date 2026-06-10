import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/httpStatus';

interface TokenPayLoad {
  userId: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayLoad;

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return next(new AppError('Invalid token or expired', HTTP_STATUS.UNAUTHORIZED));
  }
};
