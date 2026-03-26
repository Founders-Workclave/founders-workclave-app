"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { banksData } from "@/utils/settingsTab";
import SelectInput from "../selectInput";
import FormInput from "../formInput";
import AllLoading from "@/layout/Loader";

interface PayoutData {
  payoutBank: string;
  payoutAccName: string;
  payoutAccNumber: string;
}

type SaveStatus = "idle" | "loading" | "success" | "error";

const PayoutsTab: React.FC = () => {
  const [payoutData, setPayoutData] = useState<PayoutData>({
    payoutBank: "",
    payoutAccName: "",
    payoutAccNumber: "",
  });
  const [isFetching, setIsFetching] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Fetch existing payout details on mount ──────────────────────────────────
  useEffect(() => {
    const fetchPayoutDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setIsFetching(false);
          return;
        }

        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://foundersapi.up.railway.app";

        const response = await fetch(`${baseUrl}/agency/edit-payout/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("GET payout failed:", response.status);
          return;
        }

        const rawText = await response.text();
        const json = JSON.parse(rawText);

        // API returns { data: { payoutBank, payoutAccName, payoutAccNumber } }
        const payout = json.data ?? json;

        setPayoutData({
          payoutBank: payout.payoutBank ?? "",
          payoutAccName: payout.payoutAccName ?? "",
          payoutAccNumber: payout.payoutAccNumber ?? "",
        });
      } catch (err) {
        console.error("Failed to load payout details:", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPayoutDetails();
  }, []);

  const handleChange = (field: keyof PayoutData, value: string) => {
    // Clear error as user edits
    setErrorMessage(null);
    setPayoutData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // ── Validation ────────────────────────────────────────────────────────────
    if (!payoutData.payoutBank) {
      setErrorMessage("Please select a bank.");
      return;
    }
    if (!payoutData.payoutAccName.trim()) {
      setErrorMessage("Please enter your account name.");
      return;
    }
    if (!payoutData.payoutAccNumber.trim()) {
      setErrorMessage("Please enter your account number.");
      return;
    }

    try {
      setSaveStatus("loading");
      setErrorMessage(null);

      const token = localStorage.getItem("access_token");
      if (!token)
        throw new Error("No access token found. Please log in again.");

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://foundersapi.up.railway.app";

      // API expects multipart/form-data — do NOT set Content-Type manually
      const formData = new FormData();
      formData.append("payoutBank", payoutData.payoutBank);
      formData.append("payoutAccNumber", payoutData.payoutAccNumber);
      formData.append("payoutAccName", payoutData.payoutAccName);

      const response = await fetch(`${baseUrl}/agency/edit-payout/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const rawText = await response.text();

      if (!response.ok) {
        let errorMsg = `Request failed with status ${response.status}`;
        try {
          const errorData = JSON.parse(rawText);
          errorMsg =
            errorData.error ||
            errorData.detail ||
            errorData.message ||
            JSON.stringify(errorData);
        } catch {
          if (rawText) errorMsg = rawText;
        }
        throw new Error(errorMsg);
      }

      // Update local state with what the server confirmed was saved
      const savedJson = JSON.parse(rawText);
      const saved = savedJson.data ?? savedJson;
      setPayoutData({
        payoutBank: saved.payoutBank ?? payoutData.payoutBank,
        payoutAccName: saved.payoutAccName ?? payoutData.payoutAccName,
        payoutAccNumber: saved.payoutAccNumber ?? payoutData.payoutAccNumber,
      });

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save payout details."
      );
    }
  };

  const isLoading = saveStatus === "loading";

  if (isFetching) {
    return <AllLoading text="Loading payout details..." />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Payout settings</h2>

      <SelectInput
        label="Bank Name"
        value={payoutData.payoutBank}
        onChange={(value) => handleChange("payoutBank", value)}
        options={banksData}
        placeholder="Select bank"
      />

      <FormInput
        label="Account Name"
        value={payoutData.payoutAccName}
        onChange={(value) => handleChange("payoutAccName", value)}
        placeholder="Enter account name"
      />

      <FormInput
        label="Account Number"
        value={payoutData.payoutAccNumber}
        onChange={(value) => handleChange("payoutAccNumber", value)}
        placeholder="Enter account number"
        type="number"
      />

      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

      {saveStatus === "success" && (
        <p className={styles.successText}>Payout details saved successfully!</p>
      )}

      <button
        className={styles.saveButton}
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default PayoutsTab;
