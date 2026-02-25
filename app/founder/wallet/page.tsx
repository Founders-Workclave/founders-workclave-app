import WalletPage from "@/components/wallet";
import FounderLayout from "@/layout/founder";

interface WalletModalProps {
  params: {
    userId: string;
  };
}

const WalletModal = ({ params }: WalletModalProps) => {
  return (
    <FounderLayout pageTitle="Wallet" pageText="">
      <WalletPage params={params} />
    </FounderLayout>
  );
};

export default WalletModal;
