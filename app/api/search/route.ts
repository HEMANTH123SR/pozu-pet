import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Get the search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      );
    }

    // Create text search conditions
    const searchRegex = new RegExp(query, "i");

    // Search discussions
    const discussions = await Discussion.find({
      $or: [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } },
      ],
    })
      .populate({
        path: "author",
        select: "username profileImage fullName",
      })
      .populate({
        path: "comments.user",
        select: "username profileImage fullName",
      })
      .populate({
        path: "upvotes",
        select: "username profileImage fullName",
      })
      .sort({ createdAt: -1 })
      .limit(10);

    // Search users
    const users = await User.find({
      $or: [
        { username: { $regex: searchRegex } },
        { fullName: { $regex: searchRegex } },
        { bio: { $regex: searchRegex } },
        { skills: { $in: [searchRegex] } },
        { interests: { $in: [searchRegex] } },
        { university: { $regex: searchRegex } },
      ],
    })
      .select("username fullName profileImage bio university skills interests")
      .limit(10);

    // Return combined results
    return NextResponse.json(
      {
        message: "success",
        data: {
          discussions,
          users,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in search:", error);
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}
