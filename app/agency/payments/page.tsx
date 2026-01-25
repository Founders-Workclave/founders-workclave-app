import AllPayments from "@/components/allPayments";
import AgencyLayout from "@/layout/agency";

const AgencyPaymentsPage = () => {
  return (
    <AgencyLayout pageTitle="Payments" pageText="">
      <AllPayments />
    </AgencyLayout>
  );
};

export default AgencyPaymentsPage;
