import MessagesPage from "@/components/messages";
import PMLayout from "@/layout/pm/page";

const PMMessageModule = ({ params }: { params: unknown }) => {
  return (
    <>
      <PMLayout pageTitle="Messages" pageText="">
        <MessagesPage params={params as { userId: string }} />
      </PMLayout>
    </>
  );
};

export default PMMessageModule;
