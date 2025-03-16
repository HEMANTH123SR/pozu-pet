import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    await connectToDatabase();
    const user = await User.findOne({ username: username });
    if (!user) {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }
    return NextResponse.json({
      data: user,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: `${error.message}`,
      success: false,
    });
  }
}
