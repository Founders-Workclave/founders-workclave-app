"use client";

import { useState } from "react";
import AddClientModal, { ClientFormData } from ".";

type CreateButtonProps = {
  buttonName?: string;
};

export default function CreateButton({ buttonName }: CreateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateClient = async (data: ClientFormData) => {
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: `${data.countryCode}${data.phoneNumber}`,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create client");
      }

      const result = await response.json();
      console.log("Client created successfully:", result);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
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
        onSubmit={handleCreateClient}
      />
    </main>
  );
}
