import ComingSoon from "@/components/comingSoon";
// import WalletPage from "@/components/wallet";
import AgencyLayout from "@/layout/agency";

interface WalletModalProps {
  params: {
    userId: string;
  };
}

const AgencyWalletModal = ({ params }: WalletModalProps) => {
  return (
    <AgencyLayout pageTitle="Wallet" pageText="">
      {/* <WalletPage params={params} /> */}
      <ComingSoon />
    </AgencyLayout>
  );
};

export default AgencyWalletModal;
