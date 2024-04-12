import { redirect } from "next/navigation";

import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getCurrentUser } from "@/lib/session";
import { ProjectInterface } from "@/common.types";
import { getProjectDetails } from "@/lib/actions/project.actions";
import { ObjectId } from "mongoose";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getCurrentUser();

  if (!session?.user) redirect("/");

  const project = await getProjectDetails(id);

  if (!project)
    return <p className="no-result-text">Failed to fetch project info</p>;

  const projectObj = {
    _id: JSON.stringify(project?._id) || "",
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    liveSiteUrl: project?.liveSiteUrl || "",
    githubUrl: project?.githubUrl || "",
    category: project?.category || "",
  };

  return (
    <Modal>
      <h3 className="modal-head-text">Edit Project</h3>

      <ProjectForm type="edit" session={session} project={projectObj} />
    </Modal>
  );
};

export default EditProject;
