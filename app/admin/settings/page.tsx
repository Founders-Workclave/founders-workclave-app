import ClientsProfileTab from "@/components/clientsSettings";
import AdminLayout from "@/layout/superAdmin";
import React from "react";

const ClientPage = () => {
  return (
    <AdminLayout pageTitle="All Projects">
      <ClientsProfileTab />
    </AdminLayout>
  );
};

export default ClientPage;
