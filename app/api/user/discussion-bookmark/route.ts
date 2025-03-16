import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { Discussion } from "@/db/models/discussion.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { discussionId, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the user by Clerk ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if discussion exists
    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return NextResponse.json(
        { message: "Discussion not found" },
        { status: 404 }
      );
    }

    // Check if already bookmarked
    const isBookmarked = user.bookmarksDiscussion.includes(discussionId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarksDiscussion = user.bookmarksDiscussion.filter(
        (id) => id.toString() !== discussionId
      );
    } else {
      // Add bookmark
      user.bookmarksDiscussion.push(discussionId);
    }

    // Save the updated user
    await user.save();

    return NextResponse.json({
      message: "Bookmark toggled successfully",
      data: {
        isBookmarked: !isBookmarked,
        bookmarkCount: user.bookmarksDiscussion.length,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error toggling bookmark",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
