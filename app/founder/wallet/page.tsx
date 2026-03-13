import ComingSoon from "@/components/comingSoon";
// import WalletPage from "@/components/wallet";
import FounderLayout from "@/layout/founder";

interface WalletModalProps {
  params: {
    userId: string;
  };
}

const WalletModal = ({}: WalletModalProps) => {
  return (
    <FounderLayout pageTitle="Wallet" pageText="">
      {/* <WalletPage params={params} /> */}
      <ComingSoon />
    </FounderLayout>
  );
};

export default WalletModal;
