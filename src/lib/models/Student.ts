import { ObjectId } from "mongodb";

export interface Student {
    _id?: ObjectId;
    userId: string; // References User._id
    enrollmentNumber: string;
    courses: string[]; // Array of Course IDs
    yearOfStudy: number;
    programme: string;
    gpa?: number;
    createdAt: Date;
    updatedAt?: Date;
    // Add other student-specific fields as needed
    profileCompleted: boolean;
    dateOfBirth?: Date;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
    };
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
    };
}   