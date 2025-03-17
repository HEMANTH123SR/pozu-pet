export const dynamic = "force-dynamic";
import { connectToDatabase } from "@/db/index";
import { Discussion } from "@/db/models/discussion.model";
import { User } from "@/db/models/user.model";
import { NextResponse } from "next/server";
import type { SortOrder } from "mongoose";

const ITEMS_PER_PAGE = 10;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const sortBy = searchParams.get("sortBy") || "recent";
    const skip = (page - 1) * ITEMS_PER_PAGE;

    await connectToDatabase();
    await User.init();

    const totalDiscussions = await Discussion.countDocuments();

    // Define sort options with proper types
    const sortOptions: { [key: string]: SortOrder } =
      sortBy === "reactions"
        ? { "comments.reactions": -1 as SortOrder }
        : { createdAt: -1 as SortOrder };

    const discussions = await Discussion.find({})
      .populate({
        path: "author",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.user",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.reactions.user",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.replies.user",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.replies.reactions.user",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "comments.replies.mentionedUser",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "poll.options.votes",
        select: "username profileImage fullName clerkId",
      })
      .populate({
        path: "collab.requests",
        select: "username profileImage fullName clerkId",
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .exec();

    return NextResponse.json(
      {
        message: "success",
        data: discussions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalDiscussions / ITEMS_PER_PAGE),
          totalItems: totalDiscussions,
          hasMore: skip + discussions.length < totalDiscussions,
        },
      },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching discussions:", error.message);
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}

// import { connectToDatabase } from "@/db/index";
// import { Event } from "@/db/models/event.model";
// import { auth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     // Get auth user ID from the request
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     // Get the frontend auth ID from query params
//     const frontendAuthId = req.nextUrl.searchParams.get("authId");

//     // Validate that frontend and backend auth IDs match
//     if (frontendAuthId !== userId) {
//       return NextResponse.json(
//         { message: "Authentication mismatch" },
//         { status: 403 }
//       );
//     }

//     await connectToDatabase();

//     // Find event and populate all related fields
//     const event = await Event.aggregate([
//       { $match: { slug: params.slug } },
//       // Populate creator details
//       {
//         $lookup: {
//           from: "users",
//           localField: "createdBy",
//           foreignField: "_id",
//           as: "creator",
//           pipeline: [
//             {
//               $project: {
//                 _id: 1,
//                 username: 1,
//                 fullName: 1,
//                 profileImage: 1,
//                 clerkId: 1,
//               },
//             },
//           ],
//         },
//       },
//       { $unwind: "$creator" },

//       // Populate organizers
//       {
//         $lookup: {
//           from: "users",
//           localField: "organizers.userId",
//           foreignField: "_id",
//           as: "organizedUsers",
//           pipeline: [
//             {
//               $project: {
//                 _id: 1,
//                 username: 1,
//                 fullName: 1,
//                 profileImage: 1,
//                 clerkId: 1,
//               },
//             },
//           ],
//         },
//       },

//       // Populate support team
//       {
//         $lookup: {
//           from: "users",
//           localField: "support.supportTeam.userId",
//           foreignField: "_id",
//           as: "supportTeamUsers",
//           pipeline: [
//             {
//               $project: {
//                 _id: 1,
//                 username: 1,
//                 fullName: 1,
//                 profileImage: 1,
//                 clerkId: 1,
//               },
//             },
//           ],
//         },
//       },

//       // Populate schedule speakers if they are users
//       {
//         $lookup: {
//           from: "users",
//           localField: "schedule.speakers.userId",
//           foreignField: "_id",
//           as: "scheduleSpeekers",
//           pipeline: [
//             {
//               $project: {
//                 _id: 1,
//                 username: 1,
//                 fullName: 1,
//                 profileImage: 1,
//                 clerkId: 1,
//               },
//             },
//           ],
//         },
//       },

//       // Add fields to map populated users back to their respective arrays
//       {
//         $addFields: {
//           organizers: {
//             $map: {
//               input: "$organizers",
//               as: "organizer",
//               in: {
//                 $mergeObjects: [
//                   "$$organizer",
//                   {
//                     user: {
//                       $arrayElemAt: [
//                         {
//                           $filter: {
//                             input: "$organizedUsers",
//                             cond: { $eq: ["$$this._id", "$$organizer.userId"] },
//                           },
//                         },
//                         0,
//                       ],
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//           "support.supportTeam": {
//             $map: {
//               input: "$support.supportTeam",
//               as: "supporter",
//               in: {
//                 $mergeObjects: [
//                   "$$supporter",
//                   {
//                     user: {
//                       $arrayElemAt: [
//                         {
//                           $filter: {
//                             input: "$supportTeamUsers",
//                             cond: { $eq: ["$$this._id", "$$supporter.userId"] },
//                           },
//                         },
//                         0,
//                       ],
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//           schedule: {
//             $map: {
//               input: "$schedule",
//               as: "session",
//               in: {
//                 $mergeObjects: [
//                   "$$session",
//                   {
//                     speakers: {
//                       $map: {
//                         input: "$$session.speakers",
//                         as: "speaker",
//                         in: {
//                           $mergeObjects: [
//                             "$$speaker",
//                             {
//                               user: {
//                                 $arrayElemAt: [
//                                   {
//                                     $filter: {
//                                       input: "$scheduleSpeekers",
//                                       cond: {
//                                         $eq: ["$$this._id", "$$speaker.userId"],
//                                       },
//                                     },
//                                   },
//                                   0,
//                                 ],
//                               },
//                             },
//                           ],
//                         },
//                       },
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//         },
//       },

//       // Clean up temporary fields
//       {
//         $project: {
//           organizedUsers: 0,
//           supportTeamUsers: 0,
//           scheduleSpeekers: 0,
//         },
//       },
//     ]);

//     if (!event.length) {
//       return NextResponse.json({ message: "Event not found" }, { status: 404 });
//     }

//     // Verify the event creator matches the authenticated user
//     if (event[0].creator.clerkId !== userId) {
//       return NextResponse.json(
//         { message: "Unauthorized to view this event" },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({
//       message: "Event retrieved successfully",
//       data: event[0],
//     });
//   } catch (error) {
//     console.error("Error retrieving event:", error);
//     return NextResponse.json(
//       { message: "Failed to retrieve event" },
//       { status: 500 }
//     );
//   }
// }
