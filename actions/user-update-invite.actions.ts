// actions/user-update-invite.actions.ts
"use server";

import { User } from "@/db/models/user.model";
import { connectToDatabase } from "@/db/index";

export async function updateUserInvites(
  inviterUsername: string,
  newUserName: string
) {
  console.log(
    "user update action called ",
    inviterUsername,
    "invite username",
    newUserName,
    "new username"
  );
  try {
    await connectToDatabase();

    const inviterUser = await User.findOne({ username: inviterUsername });
    const newUser = await User.findOne({ username: newUserName });

    if (!inviterUser || !newUser) {
      console.error("User not found:", { inviterUsername, newUserName });
      return false;
    }

    if (!inviterUser.invitesSent.includes(newUser._id)) {
      inviterUser.invitesSent.push(newUser._id);
      await inviterUser.save();
      return true;
    } else {
      console.log("User already in inviter's list");
      return true;
    }
  } catch (error) {
    console.error("Error updating user invites:", error);
    return false;
  }
}
