import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(request: NextRequest) {
  try {
    const { userId, action } = await request.json();

    // Get current user from clerk
    const { userId: currentUserId } = getAuth(request);

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (!userId || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Validate action
    if (!["follow", "unfollow"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get both users
      const currentUser = await User.findOne({
        clerkId: currentUserId,
      }).session(session);
      const targetUser = await User.findById(userId).session(session);

      if (!currentUser || !targetUser) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 404 }
        );
      }

      // Check if trying to follow/unfollow self
      if (currentUser._id.toString() === targetUser._id.toString()) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            success: false,
            message: "Cannot follow/unfollow yourself",
          },
          { status: 400 }
        );
      }

      if (action === "follow") {
        // Check if already following
        if (currentUser.following.includes(targetUser._id)) {
          await session.abortTransaction();
          return NextResponse.json(
            {
              success: false,
              message: "Already following this user",
            },
            { status: 400 }
          );
        }

        // Update both users
        currentUser.following.push(targetUser._id);
        targetUser.followers.push(currentUser._id);
      } else {
        // Check if actually following
        if (!currentUser.following.includes(targetUser._id)) {
          await session.abortTransaction();
          return NextResponse.json(
            {
              success: false,
              message: "Not following this user",
            },
            { status: 400 }
          );
        }

        // Remove from both arrays
        currentUser.following = currentUser.following.filter(
          (id) => id.toString() !== targetUser._id.toString()
        );
        targetUser.followers = targetUser.followers.filter(
          (id) => id.toString() !== currentUser._id.toString()
        );
      }

      // Save both users
      await currentUser.save({ session });
      await targetUser.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      return NextResponse.json({
        success: true,
        message: `Successfully ${action}ed user`,
        data: {
          following: currentUser.following,
          followers: targetUser.followers,
        },
      });
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  } catch (error) {
    console.error("Follow/Unfollow error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
