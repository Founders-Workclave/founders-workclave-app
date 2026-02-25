import AllPayments from "@/components/allPayments";
import FounderLayout from "@/layout/founder";

const PaymentsPage = () => {
  return (
    <FounderLayout pageTitle="Payments" pageText="">
      <AllPayments />
    </FounderLayout>
  );
};

export default PaymentsPage;
