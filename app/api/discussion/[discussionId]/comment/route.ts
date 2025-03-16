import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { User } from "@/db/models/user.model";

// Create a new comment
export async function POST(
  request: Request,
  { params }: { params: { discussionId: string } }
) {
  try {
    console.log("comment function called with params:", params);
    const { content, userId } = await request.json();
    console.log("comment function called with content:", content);
    console.log("comment function called with userId:", userId);

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Comment content is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const discussion = await Discussion.findById(params.discussionId);
    if (!discussion) {
      return NextResponse.json(
        { message: "Discussion not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newComment = {
      content,
      user: userId,
      createdAt: new Date(),
      reactions: [],
      replies: [],
    };

    discussion.comments.push(newComment);
    discussion.commentCount = discussion.comments.length;
    await discussion.save();

    // Populate the user details for the new comment
    const populatedComment = await Discussion.findById(params.discussionId)
      .select("comments")
      .populate({
        path: "comments.user",
        select: "username profileImage fullName clerkId",
      })
      .then((doc) => doc.comments[doc.comments.length - 1]);

    return NextResponse.json(
      { message: "Comment created successfully", comment: populatedComment },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Error creating comment", error: error.message },
      { status: 500 }
    );
  }
}
