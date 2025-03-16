import { connectToDatabase } from "@/db/index";
import { Competition } from "@/db/models/competition.model"; // Assuming the Event model from previous schema
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const requestData = await req.json();
    console.log("Received event data", requestData);

    const { competitionData, clerkUserId, authorMongoId } = requestData;

    // Validate user authorization
    if (userId !== clerkUserId && authorMongoId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existingCompetition = await Competition.findOne({
      slug: competitionData.slug,
    });

    if (existingCompetition) {
      return NextResponse.json(
        {
          message: "Slug is already in use. Please choose a different slug.",
          slugInUse: true,
        },
        { status: 400 } // Bad Request status
      );
    }
    // Create the Competition
    const dbResponse = await Competition.create(competitionData);

    console.log("Competition creation response", dbResponse);

    return NextResponse.json(
      {
        message: "Competition created successfully",
        data: dbResponse,
        slug: dbResponse.slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Competition creation error:", error);
    return NextResponse.json(
      {
        message: "Competition creation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
