import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { DiscussionDetailed } from "@/app/discussions/lib/interface";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await params;

    await connectToDatabase();
    await User.find({});

    const discussion = await Discussion.findById(discussionId)
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
        path: "upvotes",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "downvotes",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "collab.requests",
        select: "username profileImage fullName clerkId",
      })
      .exec()
      .then((doc) => {
        if (doc) {
          // Sort comments by createdAt in descending order
          doc.comments.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

          // Sort replies within each comment
          doc.comments.forEach((comment) => {
            if (comment.replies && comment.replies.length > 0) {
              comment.replies.sort((a, b) => {
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              });
            }
          });

          return doc;
        }
        return null;
      });

    if (!discussion) {
      return NextResponse.json(
        { message: "Discussion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "success",
        data: discussion as DiscussionDetailed,
      },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching discussion:", error.message);

    if (error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid discussion ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await params;
    const { userId } = await auth();
    const cUser = await currentUser();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return NextResponse.json(
        { message: "Discussion not found" },
        { status: 404 }
      );
    }

    if (discussion.author.toString() !== cUser.publicMetadata.mongoDbUserId) {
      return NextResponse.json(
        { message: "Unauthorized - You can only delete your own discussions" },
        { status: 403 }
      );
    }

    await Discussion.findByIdAndDelete(discussionId);

    return NextResponse.json(
      { message: "Discussion deleted successfully" },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting discussion:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid discussion ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error deleting discussion", error: error.message },
      { status: 500 }
    );
  }
}
