import WalletPage from "@/components/wallet";
import AgencyLayout from "@/layout/agency";

interface WalletModalProps {
  params: {
    userId: string;
  };
}

const AgencyWalletModal = ({ params }: WalletModalProps) => {
  return (
    <AgencyLayout pageTitle="Wallet" pageText="">
      <WalletPage params={params} />
    </AgencyLayout>
  );
};

export default AgencyWalletModal;
