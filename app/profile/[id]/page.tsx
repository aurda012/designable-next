import ProfilePage from "@/components/ProfilePage";
import { getUserProjects } from "@/lib/actions/user.actions";

type Props = {
  params: {
    id: string;
  };
};

const UserProfile = async ({ params }: Props) => {
  const user = await getUserProjects(params.id);

  if (!user) return <p className="no-result-text">Failed to fetch user info</p>;

  return <ProfilePage user={user} />;
};

export default UserProfile;
