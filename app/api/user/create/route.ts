import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model"; // Assuming your model is in this path
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse the request body
    const body = await request.json();

    // Basic validation
    const requiredFields = ["username", "fullName", "email"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [
        { username: body.username.toLowerCase() },
        { email: body.email.toLowerCase() },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      ...body,
      username: body.username.toLowerCase(),
      email: body.email.toLowerCase(),
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Remove sensitive fields if any and return response
    const userResponse = savedUser.toObject();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
