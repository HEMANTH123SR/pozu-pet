import mongoose from "mongoose";

const studentVerificationSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    collegeIdNumber: {
      type: String,
      required: true,
    },
    collegeIdCard: {
      type: String, // This will store the image ID from Appwrite
      required: true,
    },
    selfieCard: {
      type: String, // This will store the image ID from Appwrite
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Check if the model already exists before creating a new one
export const StudentVerification =
  mongoose.models.StudentVerification ||
  mongoose.model("StudentVerification", studentVerificationSchema);
