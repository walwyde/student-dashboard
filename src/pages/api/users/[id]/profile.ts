// pages/api/users/[id]/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, WithId, Document, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    return getProfile(req, res, id as string);
  }
  
  if (req.method === 'PUT') {
    return updateProfile(req, res, id as string);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

async function getProfile(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await client.connect();
    const db = client.db();
    const profiles = db.collection('profiles');

    var profile: WithId<Document> = await profiles.findOne({ userId });

    if (!profile) {
      // Create default profile if it doesn't exist
       profile = {
        _id: new ObjectId(),
        userId,
        bio: '',
        avatar: '',
        preferences: {},
        createdAt: new Date(),
      };
      
      await profiles.insertOne(profile);

      return res.status(200).json(profile);
    }
    console.log(profile)
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
}

async function updateProfile(req: NextApiRequest, res: NextApiResponse, userId: string) {
const authHeader = req.headers.authorization;
const token = Array.isArray(authHeader) ? authHeader[0]?.split(' ')[1] : authHeader?.split(' ')[1];
if (!token) {
  return res.status(401).json({ message: 'No token provided' });
}

const client = new MongoClient(MONGODB_URI);

try {
  // Verify token and ensure user can only update their own profile
  const decoded = jwt.verify(token as string, JWT_SECRET) as unknown as { userId: string };
  
  if (decoded.userId.toString() !== userId.toString()) {
      console.log("Unauthorized profile update attempt:", { decodedUserId: decoded.userId, targetUserId: userId });
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log("request-body", req.body)

    await client.connect();
    const db = client.db();
    const profiles = db.collection('profiles');

    const updateData = {
      ...req.body,
      userId, // Ensure userId can't be changed
      updatedAt: new Date(),
    };

    const result = await profiles.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { upsert: true }
    );
    
console.log("updated", result)
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
}