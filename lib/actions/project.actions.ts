"use server";

import { ProjectForm, ProjectInterface } from "@/common.types";
import { connectToDB } from "../mongoose";
import Project from "../models/project.model";
import User from "../models/user.model";
import { ObjectId } from "mongoose";

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
  creatorId: ObjectId
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

export async function fetchProjects(
  category = null,
  pageNumber = 1,
  pageSize = 20
) {
  try {
    connectToDB();

    // Calculate the number of fibers to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts that have no parents (top-level fibers)
    const findQuery = category ? { category: category } : {};
    const projectsQuery = Project.find(findQuery)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "createdBy", model: User });

    const totalProjectsCount = await Project.countDocuments(findQuery);

    const projects = await projectsQuery.exec();

    const isNext = totalProjectsCount > skipAmount + projects.length;

    return { projects, isNext };
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to fetch fibers: ${error.message}`);
  }
}

export async function getProjectDetails(id: string) {
  try {
    connectToDB();

    return await Project.findById(id).populate({
      path: "createdBy",
      model: User,
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
}

export async function deleteProject(projectId: ObjectId, userId: ObjectId) {
  try {
    connectToDB();

    await Project.deleteOne({ _id: projectId });

    console.log(userId);

    await User.findByIdAndUpdate(userId, {
      $pull: { projects: { $in: [projectId] } },
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}
