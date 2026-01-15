import MessagesPage from "@/components/messages";
import AdminLayout from "@/layout/superAdmin";

const AdminFounder = ({ params }: { params: { userId: string } }) => {
  return (
    <>
      <AdminLayout pageTitle="Messages">
        <MessagesPage params={params as { userId: string }} />
      </AdminLayout>
    </>
  );
};

export default AdminFounder;
