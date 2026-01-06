import ProductsDetailsComp from "@/components/ProjectDetailsPage";
import FounderLayout from "@/layout/founder";

interface DashboardProps {
  params: Promise<{
    userId: string;
    projectId: string;
  }>;
}

const DashboardProject = async ({ params }: DashboardProps) => {
  const { userId, projectId } = await params;

  return (
    <FounderLayout
      pageTitle="Dashboard"
      pageText="Manage and track your product ideas"
      projectId={projectId}
      userId={userId}
    >
      <ProductsDetailsComp params={{ userId, projectId }} />
    </FounderLayout>
  );
};

export default DashboardProject;
