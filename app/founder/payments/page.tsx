import AllAgencyPayments from "@/components/allAgencyPayments";
// import AllPayments from "@/components/allPayments";
import FounderLayout from "@/layout/founder";

const PaymentsPage = () => {
  return (
    <FounderLayout pageTitle="Payments" pageText="">
      <AllAgencyPayments />
    </FounderLayout>
  );
};

export default PaymentsPage;
