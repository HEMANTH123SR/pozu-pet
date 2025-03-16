import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/index";
import { Competition } from "@/db/models/competition.model";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    const competition = await Competition.findOne({ slug });
    if (!competition) {
      return NextResponse.json(
        { message: "Competition not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "success",
        data: competition,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching competition:", error.message);
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}
