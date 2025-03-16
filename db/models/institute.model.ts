import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    shortName: {
      type: String,
      trim: true,
      unique: true,
    },
    kampusId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Contact & Location
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        default: "India",
      },
      googleMapLink: {
        type: String,
        required: true,
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"], // Only allows 'Point' geometry type
          required: true,
          default: "Point",
        },
        coordinates: {
          type: [Number], // Array of [longitude, latitude]
          required: true,
          validate: {
            validator: function (array) {
              return (
                array.length === 2 &&
                array[0] >= -180 &&
                array[0] <= 180 && // longitude
                array[1] >= -90 &&
                array[1] <= 90
              ); // latitude
            },
            message:
              "Coordinates must be in [longitude, latitude] format with valid ranges",
          },
        },
      },
    },

    // Media
    logo: {
      type: String,
      required: true, // Made required
    },
    bannerImage: {
      type: String,
      required: true, // Made required
    },
  },
  {
    timestamps: true,
  }
);

// Index for text search
instituteSchema.index({
  name: "text",
  shortName: "text",
});

// Index for geo queries
instituteSchema.index({ "location.coordinates": "2dsphere" });

export const Institute =
  mongoose.models.Institute || mongoose.model("Institute", instituteSchema);
