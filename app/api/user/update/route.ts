// import { connectToDatabase } from "@/db/index";
// import { User } from "@/db/models/user.model";
// import { NextResponse, NextRequest } from "next/server";

// // Define the social platform base URLs
// const SOCIAL_PLATFORM_BASE_URLS: Record<string, string> = {
//   Instagram: "instagram.com/",
//   LinkedIn: "linkedin.com/in/",
//   Twitter: "https://x.com/",
//   Dribbble: "dribbble.com/",
//   YouTube: "youtube.com/@",
//   GitHub: "github.com/",
//   Website: "https://",
//   Discord: "discord.com/users/",
//   Spotify: "open.spotify.com/user/",
// };

// export async function PATCH(request: NextRequest) {
//   try {
//     await connectToDatabase();

//     const body = await request.json();
//     const { userId, ...updateData } = body;

//     // Validate required fields
//     if (!userId) {
//       return NextResponse.json(
//         { error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     // Validate that there's data to update
//     if (Object.keys(updateData).length === 0) {
//       return NextResponse.json(
//         { error: "No update data provided" },
//         { status: 400 }
//       );
//     }

//     // Validate education dates if provided
//     if (updateData.education) {
//       for (const edu of updateData.education) {
//         if (edu.startDate) edu.startDate = new Date(edu.startDate);
//         if (edu.endDate) edu.endDate = new Date(edu.endDate);
//       }
//     }

//     // Process social links if provided - add base URLs
//     if (updateData.socialLinks && Array.isArray(updateData.socialLinks)) {
//       // Filter out empty links and construct full URLs
//       updateData.socialLinks = updateData.socialLinks
//         .filter(
//           (link) => link.platformName && link.link && link.link.trim() !== ""
//         )
//         .map((link) => {
//           // If the user accidentally entered the full URL, don't add the base URL again
//           const baseUrl = SOCIAL_PLATFORM_BASE_URLS[link.platformName] || "";
//           let fullLink = link.link.trim();

//           // Check if the link already starts with the base URL
//           if (
//             baseUrl &&
//             !fullLink.startsWith("http") &&
//             !fullLink.includes(baseUrl)
//           ) {
//             fullLink = baseUrl + fullLink;
//           }

//           return {
//             platformName: link.platformName,
//             link: fullLink,
//           };
//         });
//     }

//     // Validate arrays are actually arrays
//     const arrayFields = ["skills", "interests", "education", "socialLinks"];
//     for (const field of arrayFields) {
//       if (updateData[field] && !Array.isArray(updateData[field])) {
//         return NextResponse.json(
//           { error: `${field} must be an array` },
//           { status: 400 }
//         );
//       }
//     }

//     // Perform the update
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       {
//         message: "User updated successfully",
//         user: updatedUser,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return NextResponse.json(
//       { error: "Failed to update user" },
//       { status: 500 }
//     );
//   }
// }

import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Define the social platform base URLs
const SOCIAL_PLATFORM_BASE_URLS: Record<string, string> = {
  Instagram: "instagram.com/",
  LinkedIn: "linkedin.com/in/",
  Twitter: "https://x.com/",
  Dribbble: "dribbble.com/",
  YouTube: "youtube.com/@",
  GitHub: "github.com/",
  Website: "https://",
  Discord: "discord.com/users/",
  Spotify: "open.spotify.com/user/",
};

export async function PATCH(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId: clerkUserId } = await auth();

    // If no authenticated user, return unauthorized
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { userId, ...updateData } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify that the authenticated user is updating their own profile
    // Get the user from your database to check their clerkId
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the clerk user ID matches the one stored in your database
    if (existingUser.clerkId !== clerkUserId) {
      return NextResponse.json(
        { error: "You are not authorized to update this user profile" },
        { status: 403 }
      );
    }

    // Validate that there's data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    // Validate education dates if provided
    if (updateData.education) {
      for (const edu of updateData.education) {
        if (edu.startDate) edu.startDate = new Date(edu.startDate);
        if (edu.endDate) edu.endDate = new Date(edu.endDate);
      }
    }

    // Process social links if provided - add base URLs
    if (updateData.socialLinks && Array.isArray(updateData.socialLinks)) {
      // Filter out empty links and construct full URLs
      updateData.socialLinks = updateData.socialLinks
        .filter(
          (link) => link.platformName && link.link && link.link.trim() !== ""
        )
        .map((link) => {
          // If the user accidentally entered the full URL, don't add the base URL again
          const baseUrl = SOCIAL_PLATFORM_BASE_URLS[link.platformName] || "";
          let fullLink = link.link.trim();

          // Check if the link already starts with the base URL
          if (
            baseUrl &&
            !fullLink.startsWith("http") &&
            !fullLink.includes(baseUrl)
          ) {
            fullLink = baseUrl + fullLink;
          }

          return {
            platformName: link.platformName,
            link: fullLink,
          };
        });
    }

    // Validate arrays are actually arrays
    const arrayFields = ["skills", "interests", "education", "socialLinks"];
    for (const field of arrayFields) {
      if (updateData[field] && !Array.isArray(updateData[field])) {
        return NextResponse.json(
          { error: `${field} must be an array` },
          { status: 400 }
        );
      }
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
