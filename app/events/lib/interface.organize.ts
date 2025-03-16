import { OutputData } from "@editorjs/editorjs";

export type VenueType = "offline" | "online" | "hybrid";

// Define the form data interface
export interface FormDataInterface {
  title: string;
  coverImage: File | null;
  coverImageName: string;
  description: OutputData;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  venue: {
    type: VenueType;
    location: string;
    meetLink: string;
  };
  requireApproval: boolean;
  category: string;
  maxCapacity: number;
}

export interface EventInterface {
  title: string;
  coverImage: File | null;
  coverImageName: string;
  description: OutputData;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  venue: {
    type: VenueType;
    location: string;
    meetLink: string;
  };
  requireApproval: boolean;
  category: string;
  maxCapacity: number;
  createdBy: string;
}
