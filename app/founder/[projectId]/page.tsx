import ProductsDetailsComp from "@/components/ProjectDetailsPage";
import FounderLayout from "@/layout/founder";
import { getUser } from "@/lib/api/auth";

interface DashboardProps {
  params: Promise<{
    projectId: string;
  }>;
}

const DashboardProject = async ({ params }: DashboardProps) => {
  const { projectId } = await params;
  const currentUser = getUser();

  return (
    <FounderLayout
      pageTitle="Dashboard"
      pageText="Manage and track your product ideas"
      projectId={projectId}
      userId={currentUser?.id ?? ""}
    >
      <ProductsDetailsComp
        params={{ userId: currentUser?.id ?? "", projectId }}
      />
    </FounderLayout>
  );
};

export default DashboardProject;
