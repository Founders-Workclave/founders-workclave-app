"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import FormInput from "../formInput";
import TextArea from "../textArea";

interface HelpFormData {
  name: string;
  email: string;
  subject: string;
  description: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const HelpCenterTab: React.FC = () => {
  const [formData, setFormData] = useState<HelpFormData>({
    name: "",
    email: "",
    subject: "",
    description: "",
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const handleChange = (field: keyof HelpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (submitStatus === "loading") return;

    const { name, email, subject, description } = formData;
    if (!name || !email || !subject || !description) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("loading");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", description: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting support request:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Help center</h2>
      <p className={styles.subtitle}>How can we help you?</p>

      {submitStatus === "success" && (
        <div className={styles.successBanner}>
          Your message has been sent. We&apos;ll get back to you shortly.
        </div>
      )}

      {submitStatus === "error" && (
        <div className={styles.errorBanner}>
          Something went wrong. Please fill in all fields and try again.
        </div>
      )}

      <FormInput
        label="Name"
        value={formData.name}
        onChange={(value) => handleChange("name", value)}
        placeholder="Enter fullname"
      />

      <FormInput
        label="Email address"
        type="email"
        value={formData.email}
        onChange={(value) => handleChange("email", value)}
        placeholder="Enter email address"
      />

      <FormInput
        label="Subject"
        value={formData.subject}
        onChange={(value) => handleChange("subject", value)}
        placeholder="Enter subject"
      />

      <TextArea
        label="Description"
        value={formData.description}
        onChange={(value) => handleChange("description", value)}
        placeholder="Enter description here..."
        rows={8}
      />

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={submitStatus === "loading"}
      >
        {submitStatus === "loading" ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default HelpCenterTab;
