import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { discussionId, voteType, authorMongoId } = await req.json();

    // Find the discussion
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return NextResponse.json(
        { message: "Discussion not found" },
        { status: 404 }
      );
    }

    // Handle upvote
    if (voteType === "upvote") {
      // Remove from downvotes if exists
      if (discussion.downvotes.includes(authorMongoId)) {
        discussion.downvotes = discussion.downvotes.filter(
          (id: string) => id.toString() !== authorMongoId
        );
      }

      // Toggle upvote
      if (discussion.upvotes.includes(authorMongoId)) {
        discussion.upvotes = discussion.upvotes.filter(
          (id: string) => id.toString() !== authorMongoId
        );
      } else {
        discussion.upvotes.push(authorMongoId);
      }
    }

    // Handle downvote
    if (voteType === "downvote") {
      // Remove from upvotes if exists
      if (discussion.upvotes.includes(authorMongoId)) {
        discussion.upvotes = discussion.upvotes.filter(
          (id: string) => id.toString() !== authorMongoId
        );
      }

      // Toggle downvote
      if (discussion.downvotes.includes(authorMongoId)) {
        discussion.downvotes = discussion.downvotes.filter(
          (id: string) => id.toString() !== authorMongoId
        );
      } else {
        discussion.downvotes.push(authorMongoId);
      }
    }

    await discussion.save();

    return NextResponse.json({
      message: "success",
      data: {
        upvotes: discussion.upvotes.length,
        downvotes: discussion.downvotes.length,
        hasUpvoted: discussion.upvotes.includes(authorMongoId),
        hasDownvoted: discussion.downvotes.includes(authorMongoId),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
