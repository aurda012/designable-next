import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
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
  const results = await fetchProjects(category as string, page ? +page : 1);

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
            id={JSON.stringify(project?._id)}
            image={project?.image}
            title={project?.title}
            // @ts-ignore
            name={project?.createdBy?.name}
            // @ts-ignore
            avatarUrl={project?.createdBy?.avatarUrl}
            // @ts-ignore
            userId={JSON.stringify(project?.createdBy?._id)}
          />
        ))}
      </section>

      <LoadMore
        pageNumber={page ? +page : 1}
        isNext={results?.isNext || false}
      />
    </section>
  );
};

export default Home;
