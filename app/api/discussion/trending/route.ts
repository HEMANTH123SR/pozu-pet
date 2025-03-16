import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;
const TRENDING_WINDOW_DAYS = 80; // Define trending window

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * ITEMS_PER_PAGE;

    await connectToDatabase();
    await User.init();

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - TRENDING_WINDOW_DAYS);

    // Get total count for pagination
    const totalDiscussions = await Discussion.countDocuments({
      createdAt: { $gte: dateThreshold },
    });

    const discussions = await Discussion.aggregate([
      {
        $match: {
          createdAt: { $gte: dateThreshold },
        },
      },
      {
        $addFields: {
          // Calculate engagement score
          engagementScore: {
            $add: [
              { $size: "$upvotes" },
              { $multiply: [{ $size: "$comments" }, 2] }, // Comments weight more
              "$numViews",
              { $cond: ["$isPinned", 100, 0] }, // Boost pinned posts
            ],
          },
        },
      },
      { $sort: { engagementScore: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: ITEMS_PER_PAGE },
    ]).exec();

    // Populate user details after aggregation
    await Discussion.populate(discussions, [
      {
        path: "author",
        select: "username profileImage fullName",
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
    console.error("Error fetching trending discussions:", error.message);
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}
