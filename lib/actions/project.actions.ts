"use server";

import { ProjectForm, ProjectInterface } from "@/common.types";
import { connectToDB } from "../mongoose";
import Project from "../models/project.model";
import User from "../models/user.model";
import { ObjectId } from "mongoose";
import { revalidatePath } from "next/cache";

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
  createdBy: ObjectId
) => {
  try {
    const imageUrl = await uploadImage(form.image);

    if (imageUrl.url) {
      connectToDB();

      const createdProject = await Project.create({
        ...form,
        image: imageUrl.url,
        createdBy: createdBy,
      });

      // Update User model
      await User.findByIdAndUpdate(createdBy, {
        $push: { projects: createdProject._id },
      });

      console.log("Created Project");
      revalidatePath("/");
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

export async function fetchProjects(
  category = "",
  pageNumber = 1,
  pageSize = 20
) {
  try {
    connectToDB();

    // Calculate the number of fibers to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts that have no parents (top-level fibers)
    const findQuery = category !== "" ? { category: category } : {};
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

export async function deleteProject(projectId: string, userId: string) {
  try {
    connectToDB();

    await Project.findByIdAndDelete(projectId);

    await User.findByIdAndUpdate(userId, {
      $pull: { projects: { $in: [projectId] } },
    });

    revalidatePath("/");
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

export async function updateProject(form: any, projectId: string) {
  function isBase64DataURL(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  const isUploadingNewImage = isBase64DataURL(form.image);

  let updatedForm = { ...form };

  try {
    connectToDB();

    if (isUploadingNewImage) {
      const imageUrl = await uploadImage(form.image);

      if (imageUrl.url) {
        updatedForm = { ...updatedForm, image: imageUrl.url };
      }
    }

    await Project.findByIdAndUpdate(projectId, updatedForm);

    revalidatePath("/");
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}
