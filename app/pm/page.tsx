import ManagerDashboardPage from "@/components/managersDashboardPage";
import PMLayout from "@/layout/pm/page";
import React from "react";

const PMDashboard = () => {
  return (
    <PMLayout pageTitle="All Projects" pageText="">
      <ManagerDashboardPage />
    </PMLayout>
  );
};

export default PMDashboard;
