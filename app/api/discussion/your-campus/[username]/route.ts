import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { Discussion } from "@/db/models/discussion.model";
import { NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectToDatabase();

    // Get the requesting user and their university
    const user = await User.findOne({ username: params.username });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Check if user has university field filled
    if (!user.university) {
      return NextResponse.json(
        {
          message:
            "Please update your university in your profile to see campus discussions",
          success: false,
        },
        { status: 400 }
      );
    }

    // Get page number from query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Find all users from the same university
    const universityUsers = await User.find({
      university: user.university,
    }).select("_id");

    const userIds = universityUsers.map((user) => user._id);

    // Count total discussions from university users
    const totalDiscussions = await Discussion.countDocuments({
      author: { $in: userIds },
    });

    // Get discussions from university users
    const discussions = await Discussion.find({
      author: { $in: userIds },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .populate([
        {
          path: "author",
          select: "username profileImage fullName university",
        },
        {
          path: "comments.user",
          select: "username profileImage fullName",
        },
        {
          path: "comments.replies.user",
          select: "username profileImage fullName",
        },
        {
          path: "poll.options.votes",
          select: "username profileImage fullName",
        },
        {
          path: "collab.requests",
          select: "username profileImage fullName clerkId",
        },
      ]);

    // Check if there are any discussions
    if (discussions.length === 0) {
      return NextResponse.json(
        {
          message: "No discussions found from your university yet",
          success: true,
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            hasMore: false,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully fetched campus discussions",
        success: true,
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
    console.error("Error fetching campus discussions:", error);
    return NextResponse.json(
      {
        message: "Error fetching campus discussions",
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
