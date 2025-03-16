import mongoose, { Schema, Document } from "mongoose";

interface IEventAgg extends Document {
  id: string;
  name: string;
  description: string;
  cover_img?: string;
  url: string;
  slug: string;
  starts_at: string;
  ends_at: string;
  themes?: string[];
  platform: string;
}

const EventAggSchema = new Schema<IEventAgg>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    cover_img: { type: String },
    url: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    starts_at: { type: String, required: true },
    ends_at: { type: String, required: true },
    themes: { type: [String], default: [] },
    platform: { type: String, required: true },
  },
  { timestamps: true }
);

export const EventAgg =
  mongoose.models.EventAgg ||
  mongoose.model<IEventAgg>("EventAgg", EventAggSchema);
