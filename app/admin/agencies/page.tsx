import AdminAgencyComp from "@/components/adminAgencies";
import AdminLayout from "@/layout/superAdmin";

const AdminAgencies = () => {
  return (
    <>
      <AdminLayout pageTitle="Dashboard">
        <AdminAgencyComp />
      </AdminLayout>
    </>
  );
};

export default AdminAgencies;
