"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { Client } from "@/types/createPrjects";
import mockData from "../../../mocks/createProject.json";

interface SelectClientProps {
  selectedClientId: string;
  onSelect: (clientId: string) => void;
  onNext: () => void;
}

const SelectClient: React.FC<SelectClientProps> = ({
  selectedClientId,
  onSelect,
  onNext,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const clients = mockData.clients as Client[];

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProceed = () => {
    if (selectedClientId) {
      onNext();
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Select client</h3>

      <div className={styles.searchBox}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={styles.searchIcon}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.clientList}>
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={styles.clientItem}
            onClick={() => onSelect(client.id)}
          >
            <div className={styles.clientInfo}>
              <div className={styles.avatar}>{client.initials}</div>
              <span className={styles.clientName}>{client.name}</span>
            </div>
            <div className={styles.radioButton}>
              <input
                type="radio"
                checked={selectedClientId === client.id}
                onChange={() => onSelect(client.id)}
                className={styles.radio}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button
          onClick={handleProceed}
          disabled={!selectedClientId}
          className={styles.proceedButton}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default SelectClient;
