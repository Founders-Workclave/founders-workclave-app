import AllAgencyPayments from "@/components/allAgencyPayments";
// import AllPayments from "@/components/allPayments";
import ClientLayout from "@/layout/clients/page";

const PMPaymentsPage = () => {
  return (
    <ClientLayout pageTitle="Payments" pageText="">
      <AllAgencyPayments />
    </ClientLayout>
  );
};

export default PMPaymentsPage;
