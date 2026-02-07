import AllPayments from "@/components/allPayments";
import ClientLayout from "@/layout/clients/page";

const PMPaymentsPage = () => {
  return (
    <ClientLayout pageTitle="Payments" pageText="">
      <AllPayments />
    </ClientLayout>
  );
};

export default PMPaymentsPage;
