"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import { banksData } from "@/utils/settingsTab";
import SelectInput from "../selectInput";
import FormInput from "../formInput";

interface PayoutData {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

const PayoutsTab: React.FC = () => {
  const [payoutData, setPayoutData] = useState<PayoutData>({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const handleChange = (field: keyof PayoutData, value: string) => {
    setPayoutData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payoutData),
      });

      if (response.ok) {
        console.log("Payout settings saved");
      }
    } catch (error) {
      console.error("Error saving payout settings:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Payout settings</h2>

      <SelectInput
        label="Bank Name"
        value={payoutData.bankName}
        onChange={(value) => handleChange("bankName", value)}
        options={banksData}
        placeholder="Select bank"
      />

      <FormInput
        label="Account Name"
        value={payoutData.accountName}
        onChange={(value) => handleChange("accountName", value)}
        placeholder="Enter account name"
      />

      <FormInput
        label="Account Number"
        value={payoutData.accountNumber}
        onChange={(value) => handleChange("accountNumber", value)}
        placeholder="Enter account number"
        type="number"
      />

      <button className={styles.saveButton} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default PayoutsTab;
