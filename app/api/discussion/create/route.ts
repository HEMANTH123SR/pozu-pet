import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// api/discussion/create/route.ts
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const requestData = await req.json();

    const { formData, images, clerkUserId, authorMongoId } = requestData;

    if (userId !== clerkUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Prepare poll data if it exists
    let pollData;
    if (formData.poll) {
      pollData = {
        options: formData.poll.options.map((text) => ({
          text,
          votes: [],
        })),
        totalVotes: 0,
      };
    }

    // Create the discussion with properly structured data
    const dbResponse = await Discussion.create({
      title: formData.title,
      content: formData.content,
      images: images,
      category: formData.category,
      author: authorMongoId,
      poll: pollData,
      collab: formData.collab,
    });

    return NextResponse.json(
      { message: "success", data: dbResponse },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
