import { connectToDatabase } from "@/db/index";
import { StudentVerification } from "@/db/models/student.verification.model";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { username, collegeIdNumber, collegeIdCard, selfieCard } = body;

    // Validate required fields
    if (!username || !collegeIdNumber || !collegeIdCard || !selfieCard) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if verification already exists for this user
    const existingVerification = await StudentVerification.findOne({
      username,
    });
    if (existingVerification) {
      return NextResponse.json(
        { error: "Verification request already exists for this user" },
        { status: 400 }
      );
    }

    // Create new verification request with the image IDs from Appwrite
    const newVerification = new StudentVerification({
      username,
      collegeIdNumber,
      collegeIdCard, // This is now the ID from Appwrite
      selfieCard, // This is now the ID from Appwrite
    });

    await newVerification.save();

    return NextResponse.json(
      {
        message: "Verification request submitted successfully",
        verification: {
          username,
          collegeIdNumber,
          status: "pending",
          submittedAt: new Date(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating verification request:", error);
    return NextResponse.json(
      { error: "Failed to submit verification request" },
      { status: 500 }
    );
  }
}

// GET endpoint to check verification status
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get username from query parameters
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const verification = await StudentVerification.findOne({ username });

    if (!verification) {
      return NextResponse.json(
        { error: "No verification request found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: verification.status,
      submittedAt: verification.createdAt,
      reviewedAt: verification.reviewedAt,
    });
  } catch (error) {
    console.error("Error fetching verification status:", error);
    return NextResponse.json(
      { error: "Failed to fetch verification status" },
      { status: 500 }
    );
  }
}
