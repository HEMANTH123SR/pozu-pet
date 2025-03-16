import { OutputData } from "@editorjs/editorjs";

// Support Team Member
interface SupportTeamMember {
  userId: string;
  role: "lead" | "support";
}

// Support Information
interface Support {
  contactNumber?: string;
  emailAddress?: string;
  supportTeam?: SupportTeamMember[];
}

// FAQ Item
interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  order: number;
}

// Prize
interface Prize {
  _id?: string;
  title: string;
  description?: string;
  value?: number;
  rank: number;
  type: "cash" | "gift" | "certificate" | "other";
}

// Schedule Item Speaker
interface Speaker {
  name: string;
  bio?: string;
  avatar?: string;
}

// Schedule Item
interface ScheduleItem {
  _id?: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  speakers?: Speaker[];
  location?: string;
  type: "session" | "break" | "networking" | "workshop" | "other";
  track?: string;
  isPublished: boolean;
}

// Survey Question
interface SurveyQuestion {
  questionText: string;
  questionType: "text" | "multipleChoice" | "rating" | "checkbox";
  options?: string[];
  required: boolean;
}

// Survey
interface Survey {
  _id?: string;
  type: "pre" | "post";
  questions: SurveyQuestion[];
  isActive: boolean;
}

// Sponsor
interface Sponsor {
  _id?: string;
  name: string;
  logo?: string;
  website?: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  contribution: "monetary" | "inkind" | "both";
}

// Organizer
interface Organizer {
  userId: string;
  role: "owner" | "admin" | "moderator";
}

// Registration Question
interface RegistrationQuestion {
  type: "text" | "options" | "socialProfile" | "checkbox" | "website";
  question: string;
  required: boolean;
  options?: string[];
  enabled: boolean;
}

// Registration Stats
interface RegistrationStats {
  totalRegistered: number;
  confirmed: number;
  waitlist: number;
}

// Main Event Interface
export interface EventInterface {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  description: OutputData;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  timezone: string;

  venue: {
    type: "offline" | "online" | "hybrid";
    location?: string;
    meetLink?: string;
  };

  category: string;
  visibility: "public" | "private" | "unlisted";

  // Team Management
  team: "individual" | "team";
  organizers?: Organizer[];

  // Additional Features
  support?: Support;
  faqs?: FAQ[];
  prizes?: Prize[];
  schedule?: ScheduleItem[];
  surveys?: Survey[];
  sponsors?: Sponsor[];

  // Registration
  registration: {
    enabled: boolean;
    maxAttendees: number;
    requireApproval: boolean;
    questions?: RegistrationQuestion[];
  };

  registrationStats: RegistrationStats;

  // Meta
  status: "draft" | "published" | "cancelled" | "completed";
  createdBy: {
    _id: string;
    username: string;
    fullName: string;
    profileImage: string;
    clerkId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
