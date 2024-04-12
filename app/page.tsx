import { ProjectInterface } from "@/common.types";
import Categories from "@/components/Categories";
// import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { fetchProjects } from "@/lib/actions/project.actions";

type SearchParams = {
  category?: string | null;
  page?: string | null;
};

type Props = {
  searchParams: SearchParams;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({ searchParams: { category, page } }: Props) => {
  const results = await fetchProjects();

  const projects = results?.projects || [];

  if (projects.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />

        <p className="no-result-text text-center">
          No projects found, go create some first.
        </p>
      </section>
    );
  }

  return (
    <section className="flexStart flex-col paddings mb-16">
      <Categories />

      <section className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={`${project?._id}`}
            // @ts-ignore
            id={project?._id}
            image={project?.image}
            title={project?.title}
            // @ts-ignore
            name={project?.createdBy.name}
            // @ts-ignore
            avatarUrl={project?.createdBy.avatarUrl}
            // @ts-ignore
            userId={project?.createdBy.id}
          />
        ))}
      </section>

      {/* <LoadMore 
        startCursor={data?.projectSearch?.pageInfo?.startCursor} 
        endCursor={data?.projectSearch?.pageInfo?.endCursor} 
        hasPreviousPage={data?.projectSearch?.pageInfo?.hasPreviousPage} 
        hasNextPage={data?.projectSearch?.pageInfo.hasNextPage}
      /> */}
    </section>
  );
};

export default Home;
