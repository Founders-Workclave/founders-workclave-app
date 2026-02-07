import AllPayments from "@/components/allPayments";
import PMLayout from "@/layout/pm/page";

const PMPaymentsPage = () => {
  return (
    <PMLayout pageTitle="Payments" pageText="">
      <AllPayments />
    </PMLayout>
  );
};

export default PMPaymentsPage;
