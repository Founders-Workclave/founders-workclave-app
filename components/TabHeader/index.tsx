import ComponentSwitcher from "../componentSwitcher";
import DocumentsPage from "../foundersDocuments";
import MilestonesPage from "../milestone";
import PaymentHistory from "../paymentHistory";
import TabOneComponent from "../ProjectDetailsPage/index2";

interface PageProps {
  params: {
    userId: string;
    projectId: string;
  };
}

const ProjectTabs: React.FC<PageProps> = ({ params }) => {
  return (
    <ComponentSwitcher
      defaultTabId="progress"
      tabs={[
        {
          id: "progress",
          label: "Overview",
          component: <TabOneComponent params={params} />,
        },
        {
          id: "milestone",
          label: "Milestones",
          component: <MilestonesPage projectId={params.projectId} />,
        },
        {
          id: "documents",
          label: "Documents",
          component: <DocumentsPage params={params} />,
        },
        {
          id: "payments",
          label: "Payments",
          component: <PaymentHistory projectId={params.projectId} />,
        },
      ]}
    />
  );
};

export default ProjectTabs;
