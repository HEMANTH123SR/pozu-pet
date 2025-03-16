import type { Types } from "mongoose";

export interface User {
  _id: string;
  clerkId: string;
  fullName: string;
  username: string;
  profileImage: string;
}

export interface Reaction {
  _id: string;
  user: User;
  createdAt: string;
}

export interface BaseContent {
  _id?: Types.ObjectId | string;
  content: string;
  createdAt: Date | string;
  reactions: Reaction[];
  isHidden?: boolean;
  lastEditedAt?: Date | string;
}

export interface Reply extends BaseContent {
  user: User;
  mentionedUser?: User; // For replies to replies
}

export interface Comment extends BaseContent {
  user: User;
  replies: Reply[];
  replyCount: number;
}

export interface PollOption {
  text: string;
  votes: User[];
}

export interface Poll {
  options: PollOption[];
  totalVotes: number;
}

export interface Collab {
  category: string;
  numPeopleNeeded: number;
  requests: User[];
}

export interface BaseDiscussion {
  _id: Types.ObjectId | string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  category: "General" | "Competitions" | "Events" | "Feedback" | "Other";
  commentCount: number;
  comments: Comment[];
  images: string[];
  link?: string;
  numViews: number;
  isPinned: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  poll?: Poll;
  collab?: Collab;
}

export interface Discussion extends BaseDiscussion {
  upvotes: (Types.ObjectId | string)[];
  downvotes: (Types.ObjectId | string)[];
}

export interface DiscussionDetailed extends BaseDiscussion {
  upvotes: User[];
  downvotes: User[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

export interface DiscussionResponse {
  message: string;
  data: Discussion[];
  pagination: PaginationInfo;
}

export interface DiscussionsListProps {
  initialDiscussions: Discussion[];
  initialPagination: PaginationInfo;
}

export interface CreateDiscussionRequest {
  title: string;
  content: string;
  tags: string[];
  category: Discussion["category"];
  images?: string[];
  link?: string;
  poll?: Poll;
}

export interface UpdateDiscussionRequest {
  title?: string;
  content?: string;
  tags?: string[];
  category?: Discussion["category"];
  images?: string[];
  link?: string;
  poll?: Poll;
}

export interface DiscussionVoteResponse {
  message: string;
  upvotes: number;
  downvotes: number;
}
