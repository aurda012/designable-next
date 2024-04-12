import mongoose from "mongoose";

export interface Project {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const projectSchema = new mongoose.Schema<Project>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  liveSiteUrl: { type: String, required: true },
  githubUrl: { type: String, required: true },
  category: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Project =
  mongoose.models && "Project" in mongoose.models
    ? (mongoose.models.Project as mongoose.Model<Project>)
    : mongoose.model("Project", projectSchema);

export default Project;
