import { Schema, model, models } from "mongoose";

// Nested schema for team members
const TeamMemberSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["leader", "member"],
    required: true,
  },
  joinedAt: { type: Date, default: Date.now },
});

// Schema for teams
const TeamSchema = new Schema({
  name: { type: String, required: true },
  members: [TeamMemberSchema],
  projectTitle: String,
  projectDescription: String,
  projectRepository: String,
  projectDemo: String,
  submissionFiles: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  isDisqualified: { type: Boolean, default: false },
  disqualificationReason: String,
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
});

// Schema for rounds
const RoundSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  type: {
    type: String,
    enum: ["elimination", "qualifier", "final"],
    required: true,
  },
  evaluationCriteria: {
    type: String,
    required: true,
  },
  maximumTeamsToQualify: Number,
  isEliminationRound: { type: Boolean, default: false },
});

// Schema for prizes
const PrizeSchema = new Schema({
  position: { type: String, required: true }, // first, second, third, consolation
  prizeAmount: Number,
  prizeDescription: { type: String, required: true },
  sponsoredBy: String,
});

// Main Competition Schema
const CompetitionSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  participationType: {
    type: String,
    required: true,
    enum: ["public", "invite-only"],
  },
  teamRequired: {
    type: Boolean,
    required: true,
    default: false,
  },
  category: {
    type: String,
    enum: [
      "hackathon",
      "ideathon",
      "designathon",
      "coding",
      "business",
      "chess",
      "other",
    ],
    required: true,
  },
  type: {
    type: String,
    enum: ["online", "offline", "hybrid"],
    required: true,
  },
  details: {
    type: String,
    required: true,
    minLength: 500,
  },
  timeline: {
    registrationStart: { type: Date, required: true },
    registrationEnd: { type: Date, required: true },
    competitionStart: { type: Date, required: true },
    competitionEnd: { type: Date, required: true },
  },
  venue: {
    online: {
      platform: {
        type: String,
        required: function () {
          return (
            this.parent().parent().type === "online" ||
            this.parent().parent().type === "hybrid"
          );
        },
      },
      link: {
        type: String,
        required: function () {
          return (
            this.parent().parent().type === "online" ||
            this.parent().parent().type === "hybrid"
          );
        },
      },
    },
    offline: {
      address: {
        type: String,
        required: function () {
          return (
            this.parent().parent().type === "offline" ||
            this.parent().parent().type === "hybrid"
          );
        },
      },
      city: {
        type: String,
        required: function () {
          return (
            this.parent().parent().type === "offline" ||
            this.parent().parent().type === "hybrid"
          );
        },
      },
      state: {
        type: String,
        required: function () {
          return (
            this.parent().parent().type === "offline" ||
            this.parent().parent().type === "hybrid"
          );
        },
      },
      country: {
        type: String,
        required: function () {
          return (
            this.parent().parent().type === "offline" ||
            this.parent().parent().type === "hybrid"
          );
        },
      },
      pincode: {
        type: String,
        required: function () {
          return (
            this.parent().parent().type === "offline" ||
            this.parent().parent().type === "hybrid"
          );
        },
      },
    },
    venueLink: {
      type: String,
      required: function () {
        return (
          this.parent().type === "offline" || this.parent().type === "hybrid"
        );
      },
    },
  },
  rounds: [RoundSchema],
  organization: {
    name: { type: String, required: true },
    logo: String,
    website: String,
    socialMedia: {
      linkedin: String,
      twitter: String,
      instagram: String,
    },
  },
  organizers: [
    {
      user: String,
      role: String,
      contact: {
        email: String,
        phone: String,
      },
    },
  ],
  sponsors: [
    {
      name: { type: String, required: true },
      logo: String,
      website: String,
      sponsorshipTier: {
        type: String,
        enum: ["title", "platinum", "gold", "silver", "bronze", "other"],
      },
    },
  ],
  prizes: [PrizeSchema],
  teams: [TeamSchema],
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  coverImage: { type: String, required: true },
  galleryImages: [String],
  featured: { type: Boolean, default: false },
  tags: [String],
  metaData: {
    seoTitle: String,
    seoDescription: String,
    keywords: [String],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collectAbout: {
    type: Boolean,
    required: true,
    default: false,
  },
  collectContact: {
    type: Boolean,
    required: true,
    default: false,
  },
  collectEducation: {
    type: Boolean,
    required: true,
    default: false,
  },
  collectExperience: {
    type: Boolean,
    required: true,
    default: false,
  },
  collectLinks: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update timestamps
CompetitionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Competition =
  models.Competition || model("Competition", CompetitionSchema);
