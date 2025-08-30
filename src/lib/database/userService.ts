// src/lib/database/userService.ts
import { connectToDatabase } from '@/src/lib/mongodb';
import { Profile } from '@/src/lib/models/Profile';
import {User } from '@/src/lib/models/User';
import { UserPublic } from '@/src/lib/models/User';
import { ObjectId } from 'mongodb';

export class UserService {
  static async createUser(userData: Omit<User, '_id' | 'createdAt'>): Promise<ObjectId> {
    const { db } = await connectToDatabase();
    const users = db.collection<User>('users');

    const newUser: User = {
      ...userData,
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    return result.insertedId;
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const { db } = await connectToDatabase();
    const users = db.collection<User>('users');
    return users.findOne({ email });
  }

  static async findUserById(id: string): Promise<User | null> {
    const { db } = await connectToDatabase();
    const users = db.collection<User>('users');
    return users.findOne({ _id: new ObjectId(id) });
  }

  static async updateLastLogin(userId: string): Promise<void> {
    const { db } = await connectToDatabase();
    const users = db.collection<User>('users');
    
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    );
  }

  static userToPublic(user: User): UserPublic {
    return {
      id: user._id!.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }
}

export class ProfileService {
  static async getProfile(userId: string): Promise<Profile | null> {
    const { db } = await connectToDatabase();
    const profiles = db.collection<Profile>('profiles');
    return profiles.findOne({ userId });
  }

  static async createProfile(profileData: Omit<Profile, '_id' | 'createdAt'>): Promise<ObjectId> {
    const { db } = await connectToDatabase();
    const profiles = db.collection<Profile>('profiles');

    const newProfile: Profile = {
      ...profileData,
      createdAt: new Date(),
    };

    const result = await profiles.insertOne(newProfile);
    return result.insertedId;
  }

  static async getProfiles(): Promise<Profile[]> {
    const { db } = await connectToDatabase();
    const profiles = db.collection<Profile>('profiles');
    return profiles.find({}).toArray();
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
    const { db } = await connectToDatabase();
    const profiles = db.collection<Profile>('profiles');

    await profiles.updateOne(
      { userId },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );
  }
}
