import { connectToDatabase } from "@/db/index";
import { Institute } from "@/db/models/institute.model";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    await connectToDatabase();
    const institute = await Institute.findOne({ kampusId: slug });

    if (!institute) {
      return NextResponse.json(
        { message: "Institute not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: institute });
  } catch (error) {
    console.error("Institute fetch error:", error);
    return NextResponse.json(
      {
        message: "Institute fetch failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
