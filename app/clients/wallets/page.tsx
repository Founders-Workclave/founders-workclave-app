import WalletPage from "@/components/wallet";
import ClientLayout from "@/layout/clients/page";

interface WalletModalProps {
  params: {
    userId: string;
  };
}

const PMWalletModal = ({ params }: WalletModalProps) => {
  return (
    <ClientLayout pageTitle="Wallet" pageText="">
      <WalletPage params={params} />
    </ClientLayout>
  );
};

export default PMWalletModal;
