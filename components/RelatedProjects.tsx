import Link from "next/link";

import { ProjectInterface, UserProfile } from "@/common.types";
import Image from "next/image";
import { getUserProjects } from "@/lib/actions/user.actions";
import { ObjectId } from "mongoose";

type Props = {
  userId: ObjectId;
  projectId: ObjectId;
};

const RelatedProjects = async ({ userId, projectId }: Props) => {
  const user = await getUserProjects(userId);

  const filteredProjects = user?.projects?.filter(
    (project) => JSON.stringify(project._id) !== JSON.stringify(projectId)
  );

  if (filteredProjects?.length === 0) return null;

  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p className="text-base font-bold">More by {user?.name}</p>
        <Link
          href={`/profile/${user?.id}`}
          className="text-primary-purple text-base"
        >
          View All
        </Link>
      </div>

      <div className="related_projects-grid">
        {filteredProjects?.map((project) => (
          <div className="flexCenter related_project-card drop-shadow-card">
            <Link
              href={`/project/${project?._id}`}
              className="flexCenter group relative w-full h-full"
            >
              <Image
                src={project?.image}
                width={414}
                height={314}
                className="w-full h-full object-cover rounded-2xl"
                alt="project image"
              />

              <div className="hidden group-hover:flex related_project-card_title">
                <p className="w-full">{project?.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProjects;
