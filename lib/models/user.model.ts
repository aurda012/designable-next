import mongoose, { ObjectId } from "mongoose";
import { Project } from "./project.model";

export interface User {
  _id: ObjectId;
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  description: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  projects: Project[];
}

export const userSchema = new mongoose.Schema<User>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String, required: true },
  description: String,
  bio: String,
  githubUrl: String,
  linkedinUrl: String,
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
});

const User =
  mongoose.models && "User" in mongoose.models
    ? (mongoose.models.User as mongoose.Model<User>)
    : mongoose.model("User", userSchema);

export default User;
