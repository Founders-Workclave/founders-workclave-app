import ClientsProfileTab from "@/components/clientsSettings";
import ClientLayout from "@/layout/clients/page";
import React from "react";

const Settings = () => {
  return (
    <ClientLayout pageTitle="Settings" pageText="">
      <ClientsProfileTab />
    </ClientLayout>
  );
};

export default Settings;
