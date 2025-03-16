// /app/api/discussion/[id]/comment/[commentId]/reply/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";

export async function POST(
  request: Request,
  { params }: { params: { discussionId: string; commentId: string } }
) {
  try {
    console.log("reached");
    console.log(params);
    const { content, userId, mentionedUserId } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Reply content is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newReply = {
      content,
      user: userId,
      mentionedUser: mentionedUserId,
      createdAt: new Date(),
      reactions: [],
    };

    const discussion = await Discussion.findOneAndUpdate(
      { _id: params.discussionId, "comments._id": params.commentId },
      {
        $push: { "comments.$.replies": newReply },
        $inc: { "comments.$.replyCount": 1 },
      },
      { new: true }
    ).populate([
      {
        path: "comments.replies.user",
        select: "username profileImage fullName clerkId",
      },
      {
        path: "comments.replies.mentionedUser",
        select: "username profileImage fullName clerkId",
      },
    ]);

    if (!discussion) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    const updatedComment = discussion.comments.id(params.commentId);

    return NextResponse.json(
      { message: "Reply added successfully", comment: updatedComment },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { message: "Error adding reply", error: error.message },
      { status: 500 }
    );
  }
}
