"use server";

import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function createUser(
  id: string,
  name: string,
  email: string,
  avatarUrl: string
) {
  try {
    connectToDB();

    await User.create({
      id: id,
      name: name,
      email: email,
      avatarUrl: avatarUrl,
    });
    console.log("Created User");
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

export async function getUser(email: string) {
  try {
    connectToDB();

    console.log("Get User");

    return await User.findOne({ email: email });
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
