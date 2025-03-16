// Enum for predefined project categories
export enum ProjectCategory {
  Software = "Software",
  D2C = "Direct-to-Consumer (D2C)",
  AI_ML = "AI & Machine Learning",
  Content = "Content Creation",
  Others = "Others",
  Design = "Design",
  Art = "Art",
  Marketing = "Marketing",
  ECommerce = "E-Commerce",
  Community = "Community Projects",
}

// Interface to track user interactions with time
interface Interaction {
  userId: string; // ID of the user who performed the interaction
  timestamp: Date; // Timestamp when the interaction occurred
}

// Interface for User object
interface User {
  userId: string; // Unique ID of the user
  username: string; // Name of the user
  email: string; // Email of the user
  imageUrl: string; // Profile image URL of the user
}

// Interface for comments and replies with interaction tracking
interface Comment {
  id: string; // Unique ID for the comment
  user: User; // User who posted the comment
  content: string; // The content of the comment
  upvotes: Interaction[]; // Array of users who upvoted the comment with timestamps
  replies?: Comment[]; // Optional replies (nested comments)
  createdAt: Date; // Timestamp when the comment was created
  userClickTimestamps: Interaction[]; // Array of timestamps for when users clicked on the comment
}

// Updated interface for a single project showcase item with interaction tracking
export interface Showcase {
  id: string; // Unique identifier for the project
  projectName: string; // Name of the project
  headline: string; // Headline or main title for the project
  description: string; // Short description of the project
  creator: User; // User object for the project creator
  creatorLocation?: string; // Optional: Location of the creator
  categorie: ProjectCategory; // Categories or types of the project (enum)
  tags: string[]; // Tags related to the project (e.g., 'React', 'Design', 'JavaScript')
  builtUsing: string[]; // Technologies or tools used in the project (e.g., 'React', 'Tailwind CSS')
  carouselImages: string[]; // Array of image URLs for carousel display
  videoLink?: string | null; // Optional video link for the project, could be null
  youtubeVideo?: string | null; // Optional YouTube video link, could be null
  docs?: string | null; // Optional link to documentation, could be null
  upvotes: Interaction[]; // Array of users who upvoted the project with timestamps
  bookmarks: Interaction[]; // Array of users who bookmarked the project with timestamps
  clicks: Interaction[]; // Array of users who clicked the project card with timestamps
  projectLinkClicks: Interaction[]; // Array of users who clicked the project link with timestamps
  views: number; // Number of views (can be used for popularity tracking)
  coverImage: string; // Thumbnail or main image URL for the project
  projectUrl: string; // URL to the project detail page
  ranking?: number; // Optional: Ranking if the project is among the top
  featured?: boolean; // Whether the project is a featured project
  comments: Comment[]; // Array of comments and replies related to the project
  createdAt: Date; // Date when the project was added
  updatedAt?: Date; // Optional: Last updated date (if the project is edited or updated)
}

// Interface for a simplified showcase card used for project previews
export interface ShowcaseCard {
  id: string; // Unique identifier for the project
  projectName: string; // Name of the project
  headline: string; // Headline or main title for the project
  creator: User; // User object for the project creator
  categorie: ProjectCategory; // Categories or types of the project (enum)
  tags: string[]; // Tags related to the project (e.g., 'React', 'Design', 'JavaScript')
  builtUsing: string[]; // Technologies or tools used in the project (e.g., 'React', 'Tailwind CSS')
  coverImage: string; // Thumbnail or main image URL for the project
  projectUrl: string; // URL to the project detail page
  views: number; // Number of views (for tracking popularity)
  upvotesCount: number; // Count of upvotes (aggregate for a quick view)
  bookmarksCount: number; // Count of bookmarks (aggregate for a quick view)
  commentsCount: number; // Count of comments (aggregate for a quick view)
  featured?: boolean; // Whether the project is a featured project
  createdAt: Date; // Date when the project was added
}
