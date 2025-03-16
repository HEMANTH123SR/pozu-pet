
export interface Author {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  }
  
  export interface Tag {
    id: string;
    name: string;
    color?: string;
  }
  
  export interface ProjectStats {
    likes: number;
    comments: number;
    views?: number;
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string;
    author: Author;
    tags: Tag[];
    stats: ProjectStats;
    createdAt: Date;
    updatedAt?: Date;
    thumbnail?: string;
    demoUrl?: string;
    githubUrl?: string;
  }
  
  export interface ProjectCardProps extends Project {
    onLike?: (projectId: string) => void;
    onComment?: (projectId: string) => void;
    onShare?: (projectId: string) => void;
  }
  
  export interface SearchProjectsProps {
    onSearch: (query: string) => void;
    placeholder?: string;
  }
  
  export interface ProjectListProps {
    projects: Project[];
    isLoading?: boolean;
  }
  
  export interface ShowcaseHeaderProps {
    onShareClick: () => void;
  }