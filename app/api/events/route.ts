import { connectToDatabase } from "@/db/index";
import { Event } from "@/db/models/event.model";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";

function generateRandomString(length: number): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Validation schema for event creation
const createEventSchema = z
  .object({
    title: z.string().min(4, "Event name must be at least 4 characters long"),
    description: z.any(),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    startTime: z.string(),
    endTime: z.string(),
    venue: z.object({
      type: z.enum(["offline", "online", "hybrid"]),
      location: z.string().optional(),
      meetLink: z.string().optional(),
    }),
    category: z.string().min(1, "Category is required"),
    coverImage: z.string({
      required_error: "Cover image is required",
    }),
    requireApproval: z.boolean(),
    maxCapacity: z.number().min(2),
    userId: z.string(),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(
        `${data.startDate.toDateString()} ${data.startTime}`
      );
      return startDateTime > new Date();
    },
    { message: "Start time must be in the future" }
  )
  .refine(
    (data) => {
      const startDateTime = new Date(
        `${data.startDate.toDateString()} ${data.startTime}`
      );
      const endDateTime = new Date(
        `${data.endDate.toDateString()} ${data.endTime}`
      );
      return endDateTime > startDateTime;
    },
    { message: "End time must be after start time" }
  );

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId: authUserId } = await auth();
    if (!authUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get full user object for metadata
    const user = await currentUser();
    if (!user?.publicMetadata?.mongoDbUserId) {
      return NextResponse.json(
        { message: "User not properly configured with MongoDB ID" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse request data
    const requestData = await req.json();
    console.log("Received data:", requestData);

    // Validate request data
    const validatedData = createEventSchema.parse(requestData);

    // Verify user ID matches
    if (validatedData.userId !== authUserId) {
      return NextResponse.json(
        { message: "User ID mismatch - unauthorized operation" },
        { status: 403 }
      );
    }

    // Generate slug
    const baseSlug = slugify(validatedData.title, {
      lower: true,
      strict: true,
      trim: true,
    });
    const randomSuffix = generateRandomString(6);
    const slug = `${baseSlug}-${randomSuffix}`;

    // Create date objects
    const startDateTime = new Date(
      `${validatedData.startDate.toDateString()} ${validatedData.startTime}`
    );
    const endDateTime = new Date(
      `${validatedData.endDate.toDateString()} ${validatedData.endTime}`
    );

    // Prepare event data
    const eventData = {
      title: validatedData.title,
      slug,
      description: JSON.stringify(validatedData.description),
      coverImage: validatedData.coverImage,
      category: validatedData.category,
      startDate: startDateTime,
      endDate: endDateTime,
      timezone: "UTC", // Consider making this configurable
      venue: {
        type: validatedData.venue.type,
        address:
          validatedData.venue.type !== "online"
            ? validatedData.venue.location
            : undefined,
        meetLink:
          validatedData.venue.type !== "offline"
            ? validatedData.venue.meetLink
            : undefined,
      },
      registration: {
        enabled: true,
        maxAttendees: validatedData.maxCapacity,
        requireApproval: validatedData.requireApproval,
        questions: [
          {
            type: "text",
            question: "Full Name",
            required: true,
            enabled: true,
          },
          {
            type: "text",
            question: "Email",
            required: true,
            enabled: true,
          },
        ],
      },
      createdBy: user.publicMetadata.mongoDbUserId as string,
      status: "draft",
      clerkUserId: authUserId, // Store Clerk ID for future reference
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Creating event with data:", eventData);

    // Create event in database
    const event = await Event.create(eventData);

    // Return success response
    return NextResponse.json(
      {
        message: "Event created successfully",
        data: {
          eventId: event._id,
          slug: event.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Event creation error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "Duplicate event title",
          error: "An event with this title already exists",
        },
        { status: 409 }
      );
    }

    // Handle general errors
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown error",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// GET handler for retrieving events
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Get user's MongoDB ID
    const user = await currentUser();
    if (!user?.publicMetadata?.mongoDbUserId) {
      return NextResponse.json(
        { message: "User not properly configured" },
        { status: 400 }
      );
    }

    // Get events created by the user
    const events = await Event.find({
      createdBy: user.publicMetadata.mongoDbUserId,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    console.error("Error retrieving events:", error);

    return NextResponse.json(
      {
        message: "Failed to retrieve events",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
