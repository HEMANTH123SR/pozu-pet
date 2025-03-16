


interface Sponsor {
  id: string;
  name: string;
  logo: MediaAsset;
  link: string;
  tier?: "Platinum" | "Gold" | "Silver" | "Bronze";
  description?: string;
  contributionDetails?: string;
}

interface Prize {
  id: string;
  name: string;
  description: string;
  amount?: number;
  currency?: string;
  additionalPrizes?: string[];
  sponsorId?: string;
  category?: string;
  rank?: number;
  eligibilityCriteria?: string[];
}

interface JuryMember {
  id: string;
  name: string;
  description: string;
  image: MediaAsset;
  designation?: string;
  organization?: string;
  expertise?: string[];
  linkedinProfile?: string;
  evaluationCategories?: string[];
  availability?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface JudgingCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weightage: number;
  rubric?: {
    excellent: string;
    good: string;
    average: string;
    poor: string;
  };
}

// Media related interfaces
export interface MediaAsset {
  url: string;
  altText?: string;
  mimeType: string;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}



export interface CompetitionTheme {
  id: string;
  name: string;
  description: string;
  resources?: string[];
  constraints?: string[];
}

export enum CompetitionType {
  Hackathon = "Hackathon",
  Coding = "Coding",
  Ideathon = "Ideathon",
  WebDev = "WebDev",
  DataScience = "DataScience",
  Esports = "Esports",
  Other = "Other",
}




// Section 1: Basic Information
interface BasicInformationSection {
  sectionId: 1;
  sectionName: "Basic Information";
  isComplete: boolean;
  required: true;
  data: {
    name: string;
    tagline: string;
    description: string;
    type: CompetitionType;
    tags: string[]; // 3 tags from predefined list
    website?: string;
    isInternal: boolean;
    allowedUniversities?: string[];
  };
}

// Section 2: Timeline & Participation Rules
interface TimelineAndRulesSection {
  sectionId: 2;
  sectionName: "Timeline & Rules";
  isComplete: boolean;
  required: true;
  data: {
    dates: {
      registrationStart: Date;
      registrationEnd: Date;
      competitionStart: Date;
      competitionEnd: Date;
      evaluationStart?: Date;
      evaluationEnd?: Date;
      resultAnnouncement?: Date;
    };
    teamSettings: {
      minSize: number;
      maxSize: number;
    };
    eligibility: {
      whoCanParticipate: string;
      requiredSkills?: string[];
      prerequisites?: string[];
    };
  };
}

// Section 3: Theme & Resources
interface ThemeAndResourcesSection {
  sectionId: 3;
  sectionName: "Theme & Resources";
  isComplete: boolean;
  required: true;
  data: {
    themes?: CompetitionTheme[];
    resources: {
      guidelines: string;
      starterPack?: string;
      faqs?: {
        question: string;
        answer: string;
      }[];
    };
  };
}

// Section 4: Media & Branding
interface MediaAndBrandingSection {
  sectionId: 4;
  sectionName: "Media & Branding";
  isComplete: boolean;
  required: true;
  data: {
    media: {
      headerImage: MediaAsset;
      posterImage: MediaAsset;
      video?: MediaAsset;
      gallery?: MediaAsset[];
    };
    sponsors: Sponsor[];
  };
}

// Section 5: Prizes & Rewards
interface PrizesAndRewardsSection {
  sectionId: 5;
  sectionName: "Prizes & Rewards";
  isComplete: boolean;
  required: true;
  data: {
    prizes: Prize[];
    totalPrizePool?: number;
    certificates?: {
      participation: boolean;
      winning: boolean;
      template?: MediaAsset;
    };
    additionalPerks?: string[];
  };
}

// Section 6: Evaluation & Judging
interface EvaluationAndJudgingSection {
  sectionId: 6;
  sectionName: "Evaluation & Judging";
  isComplete: boolean;
  required: true;
  data: {
    jury: JuryMember[];
    judgingCriteria: JudgingCriteria[];
    evaluationProcess: string;
    submissionRequirements: {
      mandatoryFields: string[];
      optionalFields: string[];
      submissionFormat: string[];
      videoRequired: boolean;
      presentationRequired: boolean;
      githubRequired: boolean;
    };
  };
}

// Competition Onboarding State
interface CompetitionOnboarding {
  competitionId: string;
  sections: {
    basicInformation: BasicInformationSection;
    timelineAndRules: TimelineAndRulesSection;
    themeAndResources: ThemeAndResourcesSection;
    mediaAndBranding: MediaAndBrandingSection;
    prizesAndRewards: PrizesAndRewardsSection;
    evaluationAndJudging: EvaluationAndJudgingSection;
  };

  lastUpdated: Date;
}

// Helper type for section status

export type {
  CompetitionOnboarding,
  BasicInformationSection,
  TimelineAndRulesSection,
  ThemeAndResourcesSection,
  MediaAndBrandingSection,
  PrizesAndRewardsSection,
  EvaluationAndJudgingSection,
};


// {


// }