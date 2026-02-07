import ManagersProfileTab from "@/components/managersSettings";
import PMLayout from "@/layout/pm/page";
import React from "react";

const Settings = () => {
  return (
    <PMLayout pageTitle="Settings" pageText="">
      <ManagersProfileTab />
    </PMLayout>
  );
};

export default Settings;
