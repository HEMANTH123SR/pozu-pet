export interface DiscussionSEO {
  title?: string;
  content: string;
  createdAt: string;
  author: {
    fullName: string;
    username: string;
    profileImage?: string;
  };
  category: string;
  tags: string[];
}
