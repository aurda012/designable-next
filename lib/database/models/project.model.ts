import { Document, Schema, model, models } from "mongoose";
import { User } from "./user.model";

export interface Project extends Document {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
  createdBy: User;
}

export const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  liveSiteUrl: { type: String, required: true },
  githubUrl: { type: String, required: true },
  category: { type: String, required: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Project = models?.Project || model("Project", projectSchema);

export default Project;
