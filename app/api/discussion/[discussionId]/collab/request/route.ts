// app/api/discussions/[discussionId]/collab/request/route.ts
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

    // Find the discussion
    const discussion = await Discussion.findById(params.discussionId);
    if (!discussion || !discussion.collab) {
      return NextResponse.json({
        message: "Collaboration not found",
        success: false,
      });
    }

    const dbUserId = user._id;
    const hasRequested = discussion.collab.requests.includes(dbUserId);

    // If user already requested, remove their request (withdraw)
    if (hasRequested) {
      discussion.collab.requests = discussion.collab.requests.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (id: any) => String(id) !== String(dbUserId)
      );
      await discussion.save();

      return NextResponse.json({
        message: "Request withdrawn successfully",
        success: true,
        data: { requests: discussion.collab.requests },
      });
    }

    // Check if collab is full
    if (
      discussion.collab.requests.length >= discussion.collab.numPeopleNeeded
    ) {
      return NextResponse.json({
        message: "This collaboration is full",
        success: false,
      });
    }

    // Add new request
    discussion.collab.requests.push(dbUserId);
    await discussion.save();

    return NextResponse.json({
      message: "Request sent successfully",
      success: true,
      data: { requests: discussion.collab.requests },
    });
  } catch (error) {
    console.error("Collab request error:", error);
    return NextResponse.json({
      message: error.message || "Failed to process request",
      success: false,
    });
  }
}
