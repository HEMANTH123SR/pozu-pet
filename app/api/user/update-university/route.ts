import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { username, university } = body;

    // Validate required fields
    if (!username || !university) {
      return NextResponse.json(
        { error: "Username and university are required" },
        { status: 400 }
      );
    }

    // Update the user's university
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: { university } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "University updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json(
      { error: "Failed to update university" },
      { status: 500 }
    );
  }
}
