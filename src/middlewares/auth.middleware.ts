import { CustomRequest } from '@/types/request.type';
import dotenv from 'dotenv';
import { NextFunction, Response } from 'express';
dotenv.config();

class AuthMiddleware {
  check(req: CustomRequest, res: Response, next: NextFunction): void {
    const authKey = req.headers.authorization;
    const adminId = req.headers.adminid as string;

    if (authKey === process.env.AUTH_KEY && adminId && !!parseInt(adminId)) {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Bạn không có quyền truy cập' });
    }
  }
}

export default AuthMiddleware;
