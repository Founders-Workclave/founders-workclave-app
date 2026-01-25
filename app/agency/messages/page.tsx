import MessagesPage from "@/components/messages";
import AgencyLayout from "@/layout/agency";

const MessageModule = ({ params }: { params: unknown }) => {
  return (
    <>
      <AgencyLayout pageTitle="Messages" pageText="">
        <MessagesPage params={params as { userId: string }} />
      </AgencyLayout>
    </>
  );
};

export default MessageModule;
