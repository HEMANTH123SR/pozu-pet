import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { discussionId } = await req.json();

    const discussion = await Discussion.findByIdAndUpdate(
      discussionId,
      { $inc: { numViews: 1 } },
      { new: true }
    );

    if (!discussion) {
      return NextResponse.json(
        { message: "Discussion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "success",
      data: { numViews: discussion.numViews },
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
