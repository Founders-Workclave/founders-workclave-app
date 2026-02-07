import WalletPage from "@/components/wallet";
import PMLayout from "@/layout/pm/page";

interface WalletModalProps {
  params: {
    userId: string;
  };
}

const PMWalletModal = ({ params }: WalletModalProps) => {
  return (
    <PMLayout pageTitle="Wallet" pageText="">
      <WalletPage params={params} />
    </PMLayout>
  );
};

export default PMWalletModal;
