import { connectToDatabase } from "@/db/index";
import { Institute } from "@/db/models/institute.model";

import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // const { userId } = await auth();

    // if (!userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // if (userId !== "user_2omTx0FdXIixqXJcGqlsPfMcuMa") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    await connectToDatabase();

    const requestData = await req.json();
    console.log("Received institute data", requestData);

    const dbResponse = await Institute.create(requestData);

    console.log("Institute creation response", dbResponse);

    return NextResponse.json(
      {
        message: "Institute created successfully",
        data: dbResponse,
        slug: dbResponse.slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Institute creation error:", error);
    return NextResponse.json(
      {
        message: "Institute creation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
