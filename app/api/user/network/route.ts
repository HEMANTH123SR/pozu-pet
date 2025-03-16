import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId })
      .populate(
        "followers",
        "username fullName profileImage bio university clerkId"
      )
      .populate(
        "following",
        "username fullName profileImage bio university clerkId"
      );

    if (!user) {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }

    return NextResponse.json({
      data: {
        followers: user.followers,
        following: user.following,
      },
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
      success: false,
    });
  }
}
