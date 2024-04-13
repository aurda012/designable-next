import { Document, Schema, model, models } from "mongoose";
import { Project } from "./project.model";

export interface User extends Document {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  projects: Project[];
}

export const userSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String, required: true },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
});

const User = models?.User || model("User", userSchema);

export default User;
