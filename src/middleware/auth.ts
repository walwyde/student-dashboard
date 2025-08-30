// src/middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/src/lib/auth/jwt';
import { UserService } from '@/src/lib/database/userService';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    userId: string;
    email: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = verifyToken(token);
      
      // Verify user still exists
      const user = await UserService.findUserById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Add user data to request
      (req as AuthenticatedRequest).user = decoded;

      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}