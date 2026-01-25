"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import ProfileTab from "./profileTab";
import PayoutsTab from "./payoutTab";
import BillingTab from "./billingTab";
import HelpCenterTab from "./helpCenterTab";
import TabNavigation from "./tabNavigation";
import ResetPasswordTab from "./resetPasswordTab";

export type SettingsTab =
  | "profile"
  | "payouts"
  | "billing"
  | "reset-password"
  | "help-center";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "payouts":
        return <PayoutsTab />;
      case "billing":
        return <BillingTab />;
      case "reset-password":
        return <ResetPasswordTab />;
      case "help-center":
        return <HelpCenterTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className={styles.container}>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.content}>{renderActiveTab()}</div>
    </div>
  );
}
