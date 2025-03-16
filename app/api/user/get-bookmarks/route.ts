import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await connectToDatabase();

    // Get the current user's Clerk ID
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the user by Clerk ID
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Bookmarks retrieved successfully",
      bookmarks: user.bookmarksDiscussion,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error retrieving bookmarks",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
