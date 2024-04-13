"use server";

import { ProjectForm, ProjectInterface } from "@/common.types";
import { connectToDB } from "../database/mongoose";
import Project from "../database/models/project.model";
import User from "../database/models/user.model";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";

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
    handleError(err);
  }
};

export const createNewProject = async (form: ProjectForm, userId: string) => {
  try {
    const imageUrl = await uploadImage(form.image);

    if (imageUrl.url) {
      await connectToDB();

      const createdBy = await User.findById(userId);

      const createdProject = await Project.create({
        ...form,
        image: imageUrl.url,
        createdBy: createdBy._id,
      });

      // Update User model
      await User.findByIdAndUpdate(createdBy._id, {
        $push: { projects: createdProject._id },
      });

      console.log("Created Project");
      revalidatePath("/");
    }
  } catch (error: any) {
    handleError(error);
  }
};

export async function fetchProjects(
  category = "",
  pageNumber = 1,
  pageSize = 20
) {
  try {
    await connectToDB();

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

    return { projects: JSON.parse(JSON.stringify(projects)), isNext };
  } catch (error: any) {
    handleError(error);
  }
}

export async function getProjectDetails(id: string) {
  try {
    await connectToDB();

    const project = await Project.findById(id).populate({
      path: "createdBy",
      model: User,
    });
    return JSON.parse(JSON.stringify(project));
  } catch (error: any) {
    handleError(error);
  }
}

export async function deleteProject(projectId: string, userId: string) {
  try {
    await connectToDB();

    await Project.findByIdAndDelete(projectId);

    await User.findByIdAndUpdate(userId, {
      $pull: { projects: { $in: [projectId] } },
    });

    revalidatePath("/");
  } catch (error: any) {
    handleError(error);
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
    await connectToDB();

    if (isUploadingNewImage) {
      const imageUrl = await uploadImage(form.image);

      if (imageUrl.url) {
        updatedForm = { ...updatedForm, image: imageUrl.url };
      }
    }

    await Project.findByIdAndUpdate(projectId, updatedForm);

    revalidatePath("/");
  } catch (error: any) {
    handleError(error);
  }
}
