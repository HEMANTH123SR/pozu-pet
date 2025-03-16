// /app/api/discussion/[id]/comment/[commentId]/reaction/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";

export async function POST(
  request: Request,
  { params }: { params: { discussionId: string; commentId: string } }
) {
  try {
    const { userId } = await request.json();

    await connectToDatabase();

    // Check if user already reacted
    const existingReaction = await Discussion.findOne({
      _id: params.discussionId,
      "comments._id": params.commentId,
      "comments.reactions.user": userId,
    });

    if (existingReaction) {
      // Remove reaction if it exists
      const discussion = await Discussion.findOneAndUpdate(
        { _id: params.discussionId, "comments._id": params.commentId },
        {
          $pull: { "comments.$.reactions": { user: userId } },
        },
        { new: true }
      ).populate({
        path: "comments.reactions.user",
        select: "username profileImage fullName clerkId",
      });

      return NextResponse.json(
        {
          message: "Reaction removed",
          comment: discussion?.comments.id(params.commentId),
        },
        { status: 200 }
      );
    } else {
      // Add new reaction
      const discussion = await Discussion.findOneAndUpdate(
        { _id: params.discussionId, "comments._id": params.commentId },
        {
          $push: {
            "comments.$.reactions": {
              user: userId,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      ).populate({
        path: "comments.reactions.user",
        select: "username profileImage fullName clerkId",
      });

      return NextResponse.json(
        {
          message: "Reaction added",
          comment: discussion?.comments.id(params.commentId),
        },
        { status: 200 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error handling reaction:", error);
    return NextResponse.json(
      { message: "Error handling reaction", error: error.message },
      { status: 500 }
    );
  }
}
