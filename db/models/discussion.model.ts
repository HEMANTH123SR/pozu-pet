import { Schema, model, models } from "mongoose";

// Schema for reactions (likes) on comments
const ReactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Schema for a reply to a comment (second level)
const CommentReplySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  mentionedUser: { type: Schema.Types.ObjectId, ref: "User" }, // For replies to replies
  reactions: [ReactionSchema],
  createdAt: { type: Date, default: Date.now },
  isHidden: { type: Boolean, default: false },
  lastEditedAt: { type: Date },
});

// Schema for top-level comments
const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  reactions: [ReactionSchema],
  replyCount: { type: Number, default: 0 }, // For pagination/load more
  replies: [CommentReplySchema],
  createdAt: { type: Date, default: Date.now },
  isHidden: { type: Boolean, default: false },
  lastEditedAt: { type: Date },
});

// Poll Option Schema (unchanged)
const PollOptionSchema = new Schema({
  text: { type: String, required: true },
  votes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Poll Schema (unchanged)
const PollSchema = new Schema({
  options: [PollOptionSchema],
  totalVotes: { type: Number, default: 0 },
});

// Collab Schema (unchanged)
const CollabSchema = new Schema({
  category: { type: String, required: true },
  numPeopleNeeded: { type: Number, required: true, min: 1 },
  requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Main Discussion Schema
const DiscussionSchema = new Schema({
  title: { type: String, maxlength: 100 },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: String }],
  category: {
    type: String,
    enum: ["General", "Competitions", "Events", "Feedback", "Other"],
    default: "General",
  },
  poll: { type: PollSchema },
  collab: { type: CollabSchema },
  commentCount: { type: Number, default: 0 }, // For pagination/load more
  comments: [CommentSchema],
  images: [{ type: String }],
  link: { type: String },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  numViews: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add indexes for better query performance
DiscussionSchema.index({ createdAt: -1 });
DiscussionSchema.index({ updatedAt: -1 });
CommentSchema.index({ createdAt: -1 });
CommentSchema.index({ "reactions.count": -1 });

// Helper method to sort comments
DiscussionSchema.methods.getSortedComments = function (sortBy = "recent") {
  const comments = this.comments;

  if (sortBy === "reactions") {
    return comments.sort((a, b) => b.reactions.length - a.reactions.length);
  }

  // Default to recent
  return comments.sort((a, b) => b.createdAt - a.createdAt);
};

export const Discussion =
  models.Discussion || model("Discussion", DiscussionSchema);
