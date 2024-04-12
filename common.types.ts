import { User, Session } from "next-auth";
import { ObjectId } from "mongoose";

export type FormState = {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
};

export interface ProjectInterface {
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
  createdBy: UserProfile | ObjectId;
}

export interface UserProfile {
  _id: ObjectId;
  id: string;
  name: string;
  email: string;
  description: string | null;
  avatarUrl: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  projects: ProjectInterface[] | ObjectId[];
}

export interface SessionInterface extends Session {
  user: User & {
    _id: ObjectId;
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

export interface ProjectForm {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
}
