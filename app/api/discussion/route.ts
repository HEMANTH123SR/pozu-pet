// export const dynamic = "force-dynamic";
import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";
import type { SortOrder } from "mongoose";

const ITEMS_PER_PAGE = 10;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const sortBy = searchParams.get("sortBy") || "recent";
    const skip = (page - 1) * ITEMS_PER_PAGE;

    await connectToDatabase();
    await User.init();

    const totalDiscussions = await Discussion.countDocuments();

    // Define sort options with proper types
    const sortOptions: { [key: string]: SortOrder } =
      sortBy === "reactions"
        ? { "comments.reactions": -1 as SortOrder }
        : { createdAt: -1 as SortOrder };

    const discussions = await Discussion.find({})
      .populate({
        path: "author",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.user",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.reactions.user",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.replies.user",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.replies.reactions.user",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.replies.mentionedUser",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "poll.options.votes",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "collab.requests",
        select: "username profileImage fullName clerkId",
      })
      .sort(sortOptions)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching discussions:", error.message);
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}
