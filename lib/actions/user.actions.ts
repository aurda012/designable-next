"use server";

import User from "../database/models/user.model";
import { connectToDB } from "../database/mongoose";
import Project from "../database/models/project.model";
import { handleError } from "../utils";

export async function createUser(
  id: string,
  name: string,
  email: string,
  avatarUrl: string
) {
  try {
    await connectToDB();

    await User.create({
      id: id,
      name: name,
      email: email,
      avatarUrl: avatarUrl,
    });
    console.log("Created User");
  } catch (error: any) {
    handleError(error);
  }
}

export async function getUser(email: string) {
  try {
    await connectToDB();

    console.log("Get User");

    const user = await User.findOne({ email: email });

    return JSON.parse(JSON.stringify(user));
  } catch (error: any) {
    handleError(error);
  }
}

export async function getUserProjects(id: string) {
  try {
    await connectToDB();

    const user = User.findById(id).populate({
      path: "projects",
      model: Project,
    });

    return user;
  } catch (error: any) {
    handleError(error);
  }
}
