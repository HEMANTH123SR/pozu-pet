// /app/api/discussion/[id]/comment/[commentId]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";

// Update a comment
export async function PATCH(
  request: Request,
  { params }: { params: { discussionId: string; commentId: string } }
) {
  try {
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Comment content is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const discussion = await Discussion.findOneAndUpdate(
      {
        _id: params.discussionId,
        "comments._id": params.commentId,
      },
      {
        $set: {
          "comments.$.content": content,
          "comments.$.lastEditedAt": new Date(),
        },
      },
      { new: true }
    ).populate({
      path: "comments.user",
      select: "username profileImage fullName clerkId",
    });

    if (!discussion) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    const updatedComment = discussion.comments.find(
      (comment) => comment._id.toString() === params.commentId
    );

    return NextResponse.json(
      { message: "Comment updated successfully", comment: updatedComment },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { message: "Error updating comment", error: error.message },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(
  request: Request,
  { params }: { params: { discussionId: string; commentId: string } }
) {
  try {
    await connectToDatabase();

    const discussion = await Discussion.findOneAndUpdate(
      { _id: params.discussionId },
      {
        $pull: { comments: { _id: params.commentId } },
        $inc: { commentCount: -1 },
      },
      { new: true }
    );

    if (!discussion) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Error deleting comment", error: error.message },
      { status: 500 }
    );
  }
}
