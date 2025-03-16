import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Force Next.js to never cache this route
export const revalidate = 0; // Disable ISR caching

export async function GET() {
  try {
    // Force reconnection to ensure fresh data
    await connectToDatabase();

    // Get a raw count directly from the collection
    const db = (await connectToDatabase()).connection.db;
    const collectionName = User.collection.name; // Get the actual collection name from the model
    const count = await db.collection(collectionName).countDocuments({});

    // Add a random value to prevent any response caching
    const response = NextResponse.json({
      count,
      success: true,
      lastUpdated: new Date().toISOString(),
      nonce: Math.random(), // Add randomness to prevent response caching
    });

    // Set all possible cache prevention headers
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "-1");
    response.headers.set("Surrogate-Control", "no-store");
    response.headers.set("Vary", "*");

    return response;
  } catch (error) {
    console.error("Error fetching user count:", error);
    const errorResponse = NextResponse.json({
      message: error instanceof Error ? error.message : "An error occurred",
      success: false,
      errorTime: new Date().toISOString(),
    });

    errorResponse.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return errorResponse;
  }
}
