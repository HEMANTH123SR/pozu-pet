import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Discussion } from "@/app/discussions/lib/interface";
import { Types } from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find user and populate bookmarked discussions
    const user = await User.findOne({ clerkId: userId })
      .populate({
        path: "bookmarksDiscussion",
        populate: [
          {
            path: "author",
            select: "_id username profileImage fullName",
          },
          {
            path: "comments",
            populate: {
              path: "user replies.user",
              select: "_id username profileImage fullName",
            },
          },
        ],
        options: { sort: { createdAt: -1 } },
      })
      .exec();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Transform the data to match the BaiscDiscussion interface
    const transformedDiscussions: Discussion[] = user.bookmarksDiscussion.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (discussion: any) => ({
        _id: new Types.ObjectId(discussion._id),
        title: discussion.title,
        content: discussion.content,
        author: {
          _id: new Types.ObjectId(discussion.author._id),
          username: discussion.author.username,
          fullName: discussion.author.fullName,
          profileImage: discussion.author.profileImage,
        },
        tags: discussion.tags || [],
        category: discussion.category || "General",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        comments: discussion.comments.map((comment: any) => ({
          _id: new Types.ObjectId(comment._id),
          user: {
            _id: new Types.ObjectId(comment.user._id),
            username: comment.user.username,
            fullName: comment.user.fullName,
            profileImage: comment.user.profileImage,
          },
          content: comment.content,
          createdAt: new Date(comment.createdAt),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          replies: comment.replies.map((reply: any) => ({
            _id: new Types.ObjectId(reply._id),
            user: {
              _id: new Types.ObjectId(reply.user._id),
              username: reply.user.username,
              fullName: reply.user.fullName,
              profileImage: reply.user.profileImage,
            },
            content: reply.content,
            createdAt: new Date(reply.createdAt),
          })),
        })),
        images: discussion.images || [],
        link: discussion.link,
        numViews: discussion.numViews || 0,
        isPinned: discussion.isPinned || false,
        createdAt: new Date(discussion.createdAt),
        updatedAt: new Date(discussion.updatedAt),
        upvotes: discussion.upvotes,
        downvotes: discussion.downvotes,
      })
    );

    return NextResponse.json({
      message: "Bookmarked discussions retrieved successfully",
      data: transformedDiscussions,
    });
  } catch (error) {
    console.error("Error fetching bookmarked discussions:", error);
    return NextResponse.json(
      {
        message: "Error retrieving bookmarked discussions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
