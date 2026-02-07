import MessagesPage from "@/components/messages";
import ClientLayout from "@/layout/clients/page";

const PMMessageModule = ({ params }: { params: unknown }) => {
  return (
    <>
      <ClientLayout pageTitle="Messages" pageText="">
        <MessagesPage params={params as { userId: string }} />
      </ClientLayout>
    </>
  );
};

export default PMMessageModule;
