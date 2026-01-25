import AgencyLayout from "@/layout/agency";
import SettingsPage from "@/components/agencySettings";

const AgencySettings = () => {
  return (
    <>
      <AgencyLayout pageTitle="Setting" pageText="">
        <SettingsPage />
      </AgencyLayout>
    </>
  );
};

export default AgencySettings;
