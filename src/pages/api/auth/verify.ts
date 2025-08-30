// pages/api/auth/verify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    // Get fresh user data
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const userData = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    };

    const sessionData = {
      token,
      user: userData,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    res.status(200).json({
      user: userData,
      session: sessionData,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  } finally {
    await client.close();
  }
}
