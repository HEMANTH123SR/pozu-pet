"use server";
import { User } from "@/db/models/user.model";
import { connectToDatabase } from "@/db/index";

interface UserInterface {
  username: string;
  clerkId: string;
  fullName: string;
  email: string;
  profileImage: string;
}
export async function createUser(user: UserInterface) {
  try {
    await connectToDatabase();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
