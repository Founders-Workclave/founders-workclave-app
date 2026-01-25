import ClientInformationPage from "@/components/agencyClientDetails";
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
        <ClientInformationPage clientId={id} />
      </AgencyLayout>
    </>
  );
};

export default AdminClientInformation;
