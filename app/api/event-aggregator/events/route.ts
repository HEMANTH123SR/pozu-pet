// import { connectToDatabase } from "@/db/index";
// import { EventAgg } from "@/db/models/event.aggregator.model";
// import { NextResponse, NextRequest } from "next/server";

// export async function GET(request: NextRequest) {
//   try {
//     await connectToDatabase();

//     // Extract query params
//     const { searchParams } = new URL(request.url);
//     const search = searchParams.get("search") || "";
//     const platform = searchParams.get("platform");
//     const theme = searchParams.get("theme");

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const filter: any = {};

//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//         { platform: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (platform) {
//       filter.platform = platform;
//     }

//     if (theme) {
//       filter.themes = { $in: [theme] };
//     }

//     const events = await EventAgg.find(filter).sort({ starts_at: 1 });

//     return NextResponse.json({ events }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch events" },
//       { status: 500 }
//     );
//   }
// }

import { connectToDatabase } from "@/db/index";
import { EventAgg } from "@/db/models/event.aggregator.model";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const platform = searchParams.get("platform");
    const theme = searchParams.get("theme");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    // Improved search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { platform: { $regex: search, $options: "i" } },
        { themes: { $regex: search, $options: "i" } },
      ];
    }

    if (platform) {
      filter.platform = platform;
    }

    if (theme) {
      filter.themes = { $in: [theme] };
    }

    // Add date filtering to show only upcoming and ongoing events
    const currentDate = new Date().toISOString();
    filter.ends_at = { $gte: currentDate };

    const events = await EventAgg.find(filter).sort({ starts_at: 1 }).limit(50); // Add reasonable limit

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
