import { connectToDatabase } from "@/db/index";
import { Institute } from "@/db/models/institute.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch only the 'name' and 'kampusId' fields
    const institutes = await Institute.find().select("name kampusId");

    if (!institutes || institutes.length === 0) {
      return NextResponse.json(
        { message: "No institutes found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: institutes });
  } catch (error) {
    console.error("Institutes fetch error:", error);
    return NextResponse.json(
      {
        message: "Institutes fetch failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
