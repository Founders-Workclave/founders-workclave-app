import ClientsDashboardPage from "@/components/clientsDashboardPage";
import ClientLayout from "@/layout/clients/page";
import React from "react";

const ClientPage = () => {
  return (
    <ClientLayout pageTitle="All Projects" pageText="">
      <ClientsDashboardPage />
    </ClientLayout>
  );
};

export default ClientPage;
