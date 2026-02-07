"use client";
import { useState } from "react";
import AddClientModal from ".";
import toast from "react-hot-toast";

type CreateButtonProps = {
  buttonName?: string;
};

export default function CreateButton({ buttonName }: CreateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    console.log("Client registered successfully!");
    setIsModalOpen(false);
    window.location.reload();
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

      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </main>
  );
}
