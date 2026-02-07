"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Client } from "@/types/createPrjects";
import { clientService } from "@/lib/api/createProject/client";
import AllLoading from "@/layout/Loader";

interface SelectClientProps {
  selectedClientId: string;
  onSelect: (clientId: string) => void;
  onNext: () => void;
  mode?: "create" | "edit";
}

const SelectClient: React.FC<SelectClientProps> = ({
  selectedClientId,
  onSelect,
  onNext,
  mode = "create",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isReadOnly = mode === "edit";

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.getClientsList();

      // Transform API response to Client type
      const transformedClients: Client[] = response.clients.map((client) => {
        const nameParts = client.client.split(" ");
        const initials = nameParts
          .map((part) => part.charAt(0).toUpperCase())
          .join("")
          .slice(0, 2);

        return {
          id: client.clientID,
          name: client.client,
          email: "", // Not provided by API
          initials: initials,
        };
      });

      setClients(transformedClients);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch clients");
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProceed = () => {
    if (selectedClientId) {
      onNext();
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Select client</h3>
        <div className={styles.loadingState}>
          <AllLoading text="Loading clients..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Select client</h3>
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={fetchClients} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerWithBadge}>
        <h3 className={styles.title}>Select client</h3>
        {isReadOnly && (
          <div className={styles.readOnlyBadge}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Read-only
          </div>
        )}
      </div>

      {isReadOnly && (
        <div className={styles.infoMessage}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>
            Client selection cannot be changed when editing a project. This is
            for review only.
          </p>
        </div>
      )}

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
          disabled={isReadOnly}
        />
      </div>

      <div className={styles.clientList}>
        {filteredClients.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No clients found</p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className={`${styles.clientItem} ${
                isReadOnly ? styles.readOnlyItem : ""
              }`}
              onClick={() => !isReadOnly && onSelect(client.id)}
              style={{
                cursor: isReadOnly ? "not-allowed" : "pointer",
                opacity: isReadOnly && selectedClientId !== client.id ? 0.5 : 1,
              }}
            >
              <div className={styles.clientInfo}>
                <div className={styles.avatar}>{client.initials}</div>
                <span className={styles.clientName}>{client.name}</span>
              </div>
              <div className={styles.radioButton}>
                <input
                  type="radio"
                  checked={selectedClientId === client.id}
                  onChange={() => !isReadOnly && onSelect(client.id)}
                  className={styles.radio}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <button
          onClick={handleProceed}
          disabled={!selectedClientId}
          className={styles.proceedButton}
        >
          {isReadOnly ? "Next" : "Proceed"}
        </button>
      </div>
    </div>
  );
};

export default SelectClient;
