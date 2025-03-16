import { Schema, model, models } from "mongoose";

const SupportSchema = new Schema({
  contactNumber: String,
  emailAddress: String,
  supportTeam: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["lead", "support"],
        default: "support",
      },
    },
  ],
});

const FAQSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const PrizeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  value: Number,
  rank: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["cash", "gift", "certificate", "other"],
    default: "other",
  },
});

const ScheduleItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  speakers: [
    {
      name: String,
      bio: String,
      avatar: String,
    },
  ],
  location: String, // For hybrid events - can specify room/link
  type: {
    type: String,
    enum: ["session", "break", "networking", "workshop", "other"],
    default: "session",
  },
  track: String, // For events with multiple parallel tracks
  isPublished: {
    type: Boolean,
    default: true,
  },
});

const SurveySchema = new Schema({
  type: {
    type: String,
    enum: ["pre", "post"],
    required: true,
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      questionType: {
        type: String,
        enum: ["text", "multipleChoice", "rating", "checkbox"],
        required: true,
      },
      options: [String],
      required: {
        type: Boolean,
        default: false,
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const SponsorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo: String,
  website: String,
  tier: {
    type: String,
    enum: ["platinum", "gold", "silver", "bronze"],
    required: true,
  },
  contribution: {
    type: String,
    enum: ["monetary", "inkind", "both"],
    required: true,
  },
});

const EventSchema = new Schema({
  // Existing fields
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
    default: "UTC",
  },
  venue: {
    type: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: true,
    },
    address: String,
    meetLink: String,
  },
  category: {
    type: String,
    required: true,
  },

  // New fields
  visibility: {
    type: String,
    enum: ["public", "private", "unlisted"],
    default: "private",
  },

  // Team Management
  team: {
    type: String,
    enum: ["individual", "team"],
    default: "individual",
  },
  organizers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["owner", "admin", "moderator"],
        default: "moderator",
      },
    },
  ],

  // Additional features
  support: SupportSchema,
  faqs: [FAQSchema],
  prizes: [PrizeSchema],
  schedule: [ScheduleItemSchema], // Replaced subEvents with schedule
  surveys: [SurveySchema],
  sponsors: [SponsorSchema],

  // Existing registration settings
  registration: {
    enabled: {
      type: Boolean,
      default: true,
    },
    maxAttendees: {
      type: Number,
      required: true,
      min: 2,
    },
    requireApproval: {
      type: Boolean,
      default: false,
    },
    questions: [
      {
        type: {
          type: String,
          enum: ["text", "options", "socialProfile", "checkbox", "website"],
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        required: {
          type: Boolean,
          default: false,
        },
        options: [String],
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },

  // Existing stats
  registrationStats: {
    totalRegistered: {
      type: Number,
      default: 0,
    },
    confirmed: {
      type: Number,
      default: 0,
    },
    waitlist: {
      type: Number,
      default: 0,
    },
  },

  // Existing meta fields
  status: {
    type: String,
    enum: ["draft", "published", "cancelled", "completed"],
    default: "draft",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Existing indexes
EventSchema.index({ slug: 1 }, { unique: true });
EventSchema.index({ category: 1, startDate: 1 });
EventSchema.index({ status: 1, startDate: 1 });

// Update timestamps on save
EventSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Event = models.Event || model("Event", EventSchema);
