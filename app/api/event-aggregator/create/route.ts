import { connectToDatabase } from "@/db/index";
import { EventAgg } from "@/db/models/event.aggregator.model";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Validate required fields
    if (
      !body.id ||
      !body.name ||
      !body.description ||
      !body.url ||
      !body.slug ||
      !body.starts_at ||
      !body.ends_at ||
      !body.platform
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if event already exists
    const existingEvent = await EventAgg.findOne({ slug: body.slug });
    if (existingEvent) {
      return NextResponse.json(
        { error: "Event with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new event
    const newEvent = new EventAgg(body);
    await newEvent.save();

    return NextResponse.json(
      { message: "Event created successfully", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
