import { connectToDatabase } from "@/db/index";
import { Competition } from "@/db/models/competition.model";
import { NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

export async function GET(request: Request) {
  console.log("Competitions API Route Hit");
  console.log("Full Request URL:", request.url);

  try {
    const { searchParams } = new URL(request.url);

    // Log all received parameters
    console.log("Received Parameters:", {
      page: searchParams.get("page"),
      search: searchParams.get("search"),
      category: searchParams.get("category"),
      type: searchParams.get("type"),
    });

    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";

    const skip = (page - 1) * ITEMS_PER_PAGE;

    console.log("Connecting to Database");
    await connectToDatabase();

    // Build dynamic query based on search and filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (type) query.type = type;

    console.log("Query Built:", query);

    // Get total count for pagination info
    const totalCompetitions = await Competition.countDocuments(query);
    console.log("Total Competitions:", totalCompetitions);

    const competitions = await Competition.find(query)
      .select(
        "title slug coverImage category type timeline tags featured organization prizes"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .exec();

    console.log("Competitions Found:", competitions.length);

    return NextResponse.json(
      {
        message: "success",
        data: competitions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCompetitions / ITEMS_PER_PAGE),
          totalItems: totalCompetitions,
          hasMore: skip + competitions.length < totalCompetitions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Detailed Error in Competitions API:", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        message: "error",
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
      { status: 500 }
    );
  }
}
