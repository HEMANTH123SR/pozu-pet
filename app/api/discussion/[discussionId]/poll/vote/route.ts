// app/api/discussions/[discussionId]/poll/vote/route.ts
import { NextResponse } from "next/server";
import { Discussion } from "@/db/models/discussion.model";
import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: Request,
  { params }: { params: { discussionId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get the database user from Clerk ID
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }

    const { optionIndex } = await request.json();
    const dbUserId = user._id; // Use the database user ID for votes

    // Validate the discussion exists
    const discussion = await Discussion.findById(params.discussionId);
    if (!discussion) {
      return NextResponse.json({
        message: "Discussion not found",
        success: false,
      });
    }

    // Validate the poll exists
    if (!discussion.poll) {
      return NextResponse.json({
        message: "No poll found for this discussion",
        success: false,
      });
    }

    // Validate the option index
    if (optionIndex < 0 || optionIndex >= discussion.poll.options.length) {
      return NextResponse.json({
        message: "Invalid option index",
        success: false,
      });
    }

    // Check if user has already voted
    const hasVoted = discussion.poll.options.some((option) =>
      option.votes.includes(dbUserId)
    );

    if (hasVoted) {
      return NextResponse.json({
        message: "User has already voted",
        success: false,
      });
    }

    // Remove any previous votes by this user (shouldn't happen but just in case)
    discussion.poll.options.forEach((option) => {
      option.votes = option.votes.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (vote: any) => String(vote) !== String(dbUserId)
      );
    });

    // Add the new vote
    discussion.poll.options[optionIndex].votes.push(dbUserId);

    // Update total votes
    discussion.poll.totalVotes = discussion.poll.options.reduce(
      (total, option) => total + option.votes.length,
      0
    );

    await discussion.save();

    return NextResponse.json({
      data: discussion.poll,
      success: true,
    });
  } catch (error) {
    console.error("Poll vote error:", error);
    return NextResponse.json({
      message: error.message,
      success: false,
    });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { discussionId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const discussion = await Discussion.findById(params.discussionId);
    if (!discussion || !discussion.poll) {
      return NextResponse.json({
        message: "Poll not found",
        success: false,
      });
    }

    return NextResponse.json({
      data: discussion.poll,
      success: true,
    });
  } catch (error) {
    console.error("Poll fetch error:", error);
    return NextResponse.json({
      message: error.message,
      success: false,
    });
  }
}
