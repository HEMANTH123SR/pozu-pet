// Base interfaces for nested structures

interface SocialLink {
  platformName: string;
  link: string;
}

// Main user interface that matches the Mongoose schema
export interface UserInterface {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  username: string;
  clerkId: string;
  fullName: string;
  email: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  skills: string[];
  interests: string[];
  following: string[]; // MongoDB ObjectId strings
  followers: string[]; // MongoDB ObjectId strings
  bookmarks: string[]; // MongoDB ObjectId strings
  clubs: string[]; // MongoDB ObjectId strings
  projects: string[]; // MongoDB ObjectId strings
  university: string;
  createdAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  gender: "male" | "female" | "other";
  citizen: number;
  role: "user" | "admin";
  isActive: boolean;
  socialLinks: SocialLink[];
}
