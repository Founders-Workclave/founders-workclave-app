import AdminDashboard from "@/components/adminDashboard";
import AdminLayout from "@/layout/superAdmin";

const DashboardProject = () => {
  return (
    <>
      <AdminLayout pageTitle="Dashboard">
        <AdminDashboard />
      </AdminLayout>
    </>
  );
};

export default DashboardProject;
