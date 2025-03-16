import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    await connectToDatabase();

    // First check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch all discussions for the user
    const discussions = await Discussion.find({ author: userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate({
        path: "author",
        select: "username profileImage fullName",
      })
      .populate({
        path: "comments.user",
        select: "username profileImage fullName",
      })
      .populate({
        path: "comments.replies.user",
        select: "username profileImage fullName",
      })
      .populate({
        path: "poll.options.votes",
        select: "username profileImage fullName",
      })
      .populate({
        path: "upvotes",
        select: "username profileImage fullName",
      })
      .populate({
        path: "downvotes",
        select: "username profileImage fullName",
      })
      .populate({
        // Add population for collab.requests
        path: "collab.requests",
        select: "username profileImage fullName clerkId",
      })
      .exec();

    return NextResponse.json(
      {
        message: "success",
        data: discussions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user discussions:", error.message);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}
