import mongoose, { models } from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String },
  coverImage: { type: String },
  bio: { type: String, maxlength: 300 },
  location: { type: String },
  skills: [{ type: String }],
  interests: [{ type: String }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bookmarksDiscussion: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Discussion" },
  ],
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  university: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isActive: { type: Boolean, default: true },
  socialLinks: [
    {
      platformName: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],

  // New fields added
  invitesSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track number of invites sent
  isVerified: { type: Boolean, default: false }, // Whether user is verified
  gender: { type: String, enum: ["male", "female", "other"], default: "other" }, // Gender field with enum
  citizen: { type: Number, unique: true, sparse: true }, // Unique citizen number starting from 1
});

// // // Ensure citizen number is assigned sequentially
UserSchema.pre("save", async function (next) {
  if (!this.citizen) {
    const lastUser = await mongoose
      .model("User")
      .findOne({}, {}, { sort: { citizen: -1 } });
    this.citizen = lastUser ? lastUser.citizen + 1 : 1;
  }
  next();
});

export const User = models.User || mongoose.model("User", UserSchema);
