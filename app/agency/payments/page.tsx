import AllAgencyPayments from "@/components/allAgencyPayments";
import AgencyLayout from "@/layout/agency";

const AgencyPaymentsPage = () => {
  return (
    <AgencyLayout pageTitle="Payments" pageText="">
      <AllAgencyPayments />
    </AgencyLayout>
  );
};

export default AgencyPaymentsPage;
