// import mongoose from "mongoose";

// let isConnected = false;

// export const connectToDatabase = async () => {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(process.env.MONGODB_URI as string);
//     isConnected = true;
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     throw new Error("Failed to connect to database");
//   }
// };

import mongoose from "mongoose";

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: GlobalMongoose | undefined;
}

// Initialize the global connection cache
if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  try {
    // If we have a connection, return it
    if (global.mongoose?.conn) {
      console.log("Using existing connection");
      return global.mongoose.conn;
    }

    // If a connection is being established, wait for it
    if (!global.mongoose?.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        maxIdleTimeMS: 10000,
        autoCreate: true,
      };

      global.mongoose.promise = mongoose.connect(
        process.env.MONGODB_URI as string,
        opts
      );
    }

    try {
      // Wait for connection
      const mongooseInstance = await global.mongoose.promise;
      global.mongoose.conn = mongooseInstance;

      // Set up connection event listeners
      mongooseInstance.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
      });

      mongooseInstance.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
        if (global.mongoose) {
          global.mongoose.promise = null;
        }
      });

      mongooseInstance.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
        if (global.mongoose) {
          global.mongoose.conn = null;
          global.mongoose.promise = null;
        }
      });

      return mongooseInstance;
    } catch (error) {
      // Reset the promise if connection fails
      if (global.mongoose) {
        global.mongoose.promise = null;
      }
      throw error;
    }
  } catch (error) {
    console.error("Detailed MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
};
