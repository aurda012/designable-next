"use server";

import { ProjectForm } from "@/common.types";
import { connectToDB } from "../mongoose";
import Project from "../models/project.model";
import User from "../models/user.model";

const isProduction = process.env.NODE_ENV === "production";
const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : "http://localhost:3000";

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({
        path: imagePath,
      }),
    });
    return response.json();
  } catch (err) {
    throw err;
  }
};

export const createNewProject = async (
  form: ProjectForm,
  creatorId: string
) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    try {
      connectToDB();

      const createdProject = await Project.create({
        ...form,
        image: imageUrl.url,
        createdBy: creatorId,
      });

      // Update User model
      await User.findByIdAndUpdate(creatorId, {
        $push: { projects: createdProject._id },
      });

      console.log("Created Project");
    } catch (error: any) {
      console.error(error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }
};
