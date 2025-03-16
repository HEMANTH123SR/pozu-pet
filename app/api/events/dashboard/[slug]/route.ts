// // /app/api/events/dashboard/[slug]/route.ts
import { connectToDatabase } from "@/db/index";
import { Event } from "@/db/models/event.model";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId: serverUserId } = await auth();
    if (!serverUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Just use lean() without type and access createdBy directly
    const event = await Event.findOne({ slug: params.slug })
      .populate({
        path: "createdBy",
        select: "username fullName profileImage clerkId",
      })
      .lean();

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    console.log("event", event);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to bypass TypeScript error for createdBy
    if (!event.createdBy || event.createdBy.clerkId !== serverUserId) {
      return NextResponse.json(
        { message: "You are not authorized to view this event" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error retrieving event:", error);
    return NextResponse.json(
      { message: "Failed to retrieve event" },
      { status: 500 }
    );
  }
}
