import MessagesPage from "@/components/messages";
import FounderLayout from "@/layout/founder";

const MessageModule = ({ params }: { params: unknown }) => {
  return (
    <>
      <FounderLayout pageTitle="Messages" pageText="">
        <MessagesPage params={params as { userId: string }} />
      </FounderLayout>
    </>
  );
};

export default MessageModule;
