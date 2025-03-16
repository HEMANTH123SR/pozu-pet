// app/api/discussion/following/route.ts
import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * ITEMS_PER_PAGE;

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await User.init();
    console.log("Database connected successfully");

    // Find the user by username and get their following list
    const currentUser = await User.findOne({ username }).populate("following");

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const followingIds = currentUser.following.map((user) => user._id);

    // Get total discussions count by users the current user is following
    const totalDiscussions = await Discussion.countDocuments({
      author: { $in: followingIds },
    });

    // Fetch discussions by followed users
    const discussions = await Discussion.find({ author: { $in: followingIds } })
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
        // Add population for collab.requests
        path: "collab.requests",
        select: "username profileImage fullName clerkId",
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .exec();

    return NextResponse.json(
      {
        message: "success",
        data: discussions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalDiscussions / ITEMS_PER_PAGE),
          totalItems: totalDiscussions,
          hasMore: skip + discussions.length < totalDiscussions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching discussions:", error.message);
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}
