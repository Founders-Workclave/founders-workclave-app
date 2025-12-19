import AdminFounderComp from "@/components/adminFounder";
import AdminLayout from "@/layout/superAdmin";

const AdminFounder = () => {
  return (
    <>
      <AdminLayout pageTitle="Dashboard">
        <AdminFounderComp />
      </AdminLayout>
    </>
  );
};

export default AdminFounder;
