import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    await User.init();

    // First, get all discussions with their full data
    const discussions = await Discussion.find()
      .populate({
        path: "author",
        select: "username profileImage fullName",
      })
      .populate({
        path: "comments.user",
        select: "username profileImage fullName",
      })
      .populate({
        path: "comments.replies.user",
        select: "username profileImage fullName",
      })
      .populate({
        path: "poll.options.votes",
        select: "username profileImage fullName",
      })
      .populate({
        path: "upvotes",
        select: "username profileImage fullName",
      })
      .populate({
        path: "downvotes",
        select: "username profileImage fullName",
      })

      .populate({
        // Add population for collab.requests
        path: "collab.requests",
        select: "username profileImage fullName clerkId",
      })
      .sort({
        isPinned: -1,
        upvotes: -1,
        createdAt: -1,
      })
      .lean();

    // Filter discussions to ensure author diversity and presence of comments
    const seenAuthors = new Set();
    const filteredDiscussions = discussions.reduce((acc, discussion) => {
      // Only include discussions with comments
      if (discussion.comments && discussion.comments.length > 0) {
        const authorId = discussion.author._id.toString();

        // If we haven't seen this author before and we have less than 10 discussions
        if (!seenAuthors.has(authorId) && acc.length < 10) {
          // Sort comments by creation date
          discussion.comments.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Sort replies within each comment
          discussion.comments.forEach((comment) => {
            if (comment.replies && comment.replies.length > 0) {
              comment.replies.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
            }
          });

          seenAuthors.add(authorId);
          acc.push({
            ...discussion,
            upvoteCount: discussion.upvotes.length,
            downvoteCount: discussion.downvotes.length,
            commentCount: discussion.comments.length,
            totalReplies: discussion.comments.reduce(
              (sum, comment) => sum + (comment.replies?.length || 0),
              0
            ),
          });
        }
      }
      return acc;
    }, []);

    return NextResponse.json(
      {
        message: "success",
        data: filteredDiscussions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching top discussions:", error.message);
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}
