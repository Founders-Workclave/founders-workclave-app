import PMInformationPage from "@/components/agencyManagerDetails";
import AgencyLayout from "@/layout/agency";

interface AdminClientInformationProps {
  params: Promise<{
    id: string;
  }>;
}

const AdminClientInformation = async ({
  params,
}: AdminClientInformationProps) => {
  const { id } = await params;

  return (
    <>
      <AgencyLayout pageTitle="" pageText="">
        <PMInformationPage pmId={id} />
      </AgencyLayout>
    </>
  );
};

export default AdminClientInformation;
