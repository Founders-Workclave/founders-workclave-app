import ProjectComponet from "@/components/projectComp";
import ProjectStart from "@/components/projectStart";
import FounderLayout from "@/layout/founder";

const Dashboard = ({ params }: { params: { username: string } }) => {
  return (
    <>
      <FounderLayout
        pageTitle="Dashboard"
        userId={params.username}
        pageText="Manage and track your product ideas"
      >
        <ProjectStart />
        <ProjectComponet />
      </FounderLayout>
    </>
  );
};

export default Dashboard;
