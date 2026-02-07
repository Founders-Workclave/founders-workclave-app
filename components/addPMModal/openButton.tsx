"use client";
import { useState } from "react";
import AddPMModal, { PMFormData } from ".";
import { pmService } from "@/lib/api/agencyCreateUsers/pmService";
import toast from "react-hot-toast";

type CreateButtonProps = {
  buttonName?: string;
};

export default function CreateButton({ buttonName }: CreateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCustomSubmit = async (data: PMFormData) => {
    const result = await pmService.registerPM({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: `${data.countryCode}${data.phoneNumber}`,
      password: data.password,
    });
    console.log("API result:", result);
    toast.success("Client registered successfully!");
    toast.error("Error registering client!", { id: "registerClient" });
    toast.loading("Registering client...", { id: "registerClient" });
  };

  return (
    <main>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "12px 24px",
          backgroundColor: "#5865F2",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        {buttonName}
      </button>

      <AddPMModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCustomSubmit}
        onSuccess={() => console.log("Success callback")}
      />
    </main>
  );
}
