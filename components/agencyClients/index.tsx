"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { Pagination } from "../agencyProject/pagination";
import { fetchClientsList } from "@/lib/api/agencyService/clientService";
import type { Client, ApiClient } from "@/types/agencyClients";
import AllLoading from "@/layout/Loader";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

type FilterTab = "all" | "active" | "inactive";

const AllClientsPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const transformApiClient = (apiClient: ApiClient): Client => {
    return {
      id: apiClient.id,
      clientID: apiClient.clientID,
      name: apiClient.clientName,
      email: apiClient.email,
      phoneNumber: apiClient.phone,
      joinedDate: apiClient.dateJoined,
      status: apiClient.active ? "Active" : "Inactive",
      avatar: null,
    };
  };

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchClientsList();
      const transformedClients = response.clients.map(transformApiClient);
      setClients(transformedClients);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load clients";

      // Don't expose raw server errors to users
      if (
        errorMessage.includes("500") ||
        errorMessage.includes("502") ||
        errorMessage.includes("503") ||
        errorMessage.includes("Failed to fetch")
      ) {
        setError("service_unavailable");
      } else if (errorMessage.includes("Unauthorized")) {
        router.push("/login");
      } else {
        setError("failed_to_load");
      }

      console.error("Error loading clients:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phoneNumber && client.phoneNumber.includes(searchQuery));

    const statusLower = String(client.status).toLowerCase();

    const matchesFilter =
      filterTab === "all" ||
      (filterTab === "active" && statusLower === "active") ||
      (filterTab === "inactive" && statusLower === "inactive");

    return matchesSearch && matchesFilter;
  });

  const handleViewProfile = (clientId: string): void => {
    router.push(`/agency/clients/${clientId}`);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const getInitials = (name: string): string => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <AllLoading text="Loading Clients..." />
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load clients"
        message="We're having trouble loading your client list. Please try again."
        showRetry
        onRetry={loadClients}
      />
    );
  }

  if (filteredClients.length === 0 && !searchQuery) {
    return (
      <div className={styles.pageWrapper}>
        <ServiceUnavailable
          title="No clients yet"
          message="Your client list is empty. Clients will appear here once they're added."
          minimal
        />
      </div>
    );
  }

  const mockPaginationData = {
    totalPages: 1,
    currentPage: 1,
    totalClients: clients.length,
    perPage: clients.length,
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Filter Tabs */}
      <div className={styles.tabsContainer}>
        <button
          onClick={() => setFilterTab("all")}
          className={`${styles.tab} ${
            filterTab === "all" ? styles.tabActive : ""
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterTab("active")}
          className={`${styles.tab} ${
            filterTab === "active" ? styles.tabActive : ""
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterTab("inactive")}
          className={`${styles.tab} ${
            filterTab === "inactive" ? styles.tabActive : ""
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Clients Container */}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All clients</h1>
        </div>

        <div className={styles.searchContainer}>
          <svg
            className={styles.searchIcon}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Empty search result */}
        {filteredClients.length === 0 && searchQuery && (
          <div className={styles.emptySearch}>
            <ServiceUnavailable
              minimal
              message={`No clients found for "${searchQuery}"`}
            />
          </div>
        )}

        {/* Desktop Table View */}
        {filteredClients.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th className={styles.tableHeaderCell}>Client Name</th>
                  <th className={styles.tableHeaderCell}>Email address</th>
                  <th className={styles.tableHeaderCell}>Phone Number</th>
                  <th className={styles.tableHeaderCell}>Joined date</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.clientNameContainer}>
                        <div className={styles.avatar}>
                          {getInitials(client.name)}
                        </div>
                        <span className={styles.clientName}>{client.name}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>{client.email}</td>
                    <td className={styles.tableCell}>
                      {client.phoneNumber || "---"}
                    </td>
                    <td className={styles.tableCell}>
                      {formatDate(client.joinedDate)}
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`${styles.statusBadge} ${
                          client.status === "Active"
                            ? styles.statusActive
                            : styles.statusInactive
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <button
                        onClick={() => handleViewProfile(client.id)}
                        className={styles.viewButton}
                      >
                        View profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Card View */}
        {filteredClients.length > 0 && (
          <div className={styles.cardsContainer}>
            {filteredClients.map((client) => (
              <div key={client.id} className={styles.card}>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Client Name</span>
                  <div className={styles.cardNameValue}>
                    <div className={styles.avatar}>
                      {getInitials(client.name)}
                    </div>
                    <span className={styles.clientName}>{client.name}</span>
                  </div>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Email address</span>
                  <span className={styles.cardValue}>{client.email}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Phone Number</span>
                  <span className={styles.cardValue}>
                    {client.phoneNumber || "---"}
                  </span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Joined date</span>
                  <span className={styles.cardValue}>
                    {formatDate(client.joinedDate)}
                  </span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Status</span>
                  <span
                    className={`${styles.statusBadge} ${
                      client.status === "Active"
                        ? styles.statusActive
                        : styles.statusInactive
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
                <button
                  onClick={() => handleViewProfile(client.id)}
                  className={styles.seeDetailsButton}
                >
                  See Details
                </button>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={mockPaginationData.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AllClientsPage;
