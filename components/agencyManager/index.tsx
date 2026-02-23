"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { Pagination } from "../agencyProject/pagination";
import MessageApp from "@/svgs/messageApp";
import PrdView from "@/svgs/prdView";
import Profile from "@/svgs/profile";
import { managerService, ApiError } from "@/lib/api/agencyService/pmService";
import { ProductManager } from "@/types/agencyPm";
import AllLoading from "@/layout/Loader";
import EmptyClients from "@/svgs/emptyClients";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";
import { getAuthToken } from "@/lib/utils/auth";
import toast from "react-hot-toast";

type FilterTab = "all" | "active" | "pending";

const AllProductManagersPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [managers, setManagers] = useState<ProductManager[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startingConversationId, setStartingConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await managerService.getManagersList();

        const transformedManagers: ProductManager[] = response.managers.map(
          (manager) => ({
            id: manager.managerID,
            name: manager.managerName || "N/A",
            email: manager.email || "N/A",
            phoneNumber: manager.phone || "N/A",
            joinedDate: manager.dateJoined || new Date().toISOString(),
            status: manager.active ? "Active" : "Pending",
            avatar: null,
          })
        );

        setManagers(transformedManagers);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load managers");
        }
        console.error("Error fetching managers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const filteredPMs = managers.filter((pm) => {
    const matchesSearch =
      (pm.name?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (pm.email?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (pm.phoneNumber ?? "").includes(searchQuery);

    const statusLower = String(pm.status ?? "").toLowerCase();

    const matchesFilter =
      filterTab === "all" ||
      (filterTab === "active" && statusLower === "active") ||
      (filterTab === "pending" && statusLower === "pending");

    return matchesSearch && matchesFilter;
  });

  const handleViewProfile = (pmId: string): void => {
    router.push(`/agency/pm/${pmId}`);
  };

  const handleMessage = async (pmId: string): Promise<void> => {
    if (!pmId) {
      toast.error("PM information not available");
      return;
    }
    try {
      setStartingConversationId(pmId);
      toast.loading("Starting conversation...", { id: "message-pm" });

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
      const token = getAuthToken();

      const formData = new FormData();
      formData.append("userID", pmId);

      const response = await fetch(`${baseUrl}/chat/conversation/`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to start conversation");

      const data = await response.json();
      toast.success("Conversation started!", { id: "message-pm" });
      router.push(`/agency/messages?conversationId=${data.conversationID}`);
    } catch (err) {
      console.error("Error starting conversation:", err);
      toast.error("Failed to start conversation", { id: "message-pm" });
    } finally {
      setStartingConversationId(null);
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const getInitials = (name: string): string => {
    if (!name || name === "N/A") return "NA";
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

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <AllLoading text="Loading Managers" />
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load managers"
        message="We're having trouble loading your managers. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

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
          onClick={() => setFilterTab("pending")}
          className={`${styles.tab} ${
            filterTab === "pending" ? styles.tabActive : ""
          }`}
        >
          Pending
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All product managers</h1>
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

        {/* EMPTY STATE */}
        {filteredPMs.length === 0 && (
          <div className={styles.emptyState}>
            <EmptyClients />
            <h3>No managers yet</h3>
            <p>
              {managers.length === 0
                ? "You don't have any product managers yet."
                : "No product managers match your search or filter."}
            </p>
          </div>
        )}

        {/* Desktop Table View */}
        {filteredPMs.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th className={styles.tableHeaderCell}>Team Name</th>
                  <th className={styles.tableHeaderCell}>Email address</th>
                  <th className={styles.tableHeaderCell}>Phone Number</th>
                  <th className={styles.tableHeaderCell}>Joined date</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPMs.map((pm) => (
                  <tr key={pm.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.pmNameContainer}>
                        <div className={styles.avatar}>
                          {getInitials(pm.name)}
                        </div>
                        <span className={styles.pmName}>{pm.name}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>{pm.email}</td>
                    <td className={styles.tableCell}>{pm.phoneNumber}</td>
                    <td className={styles.tableCell}>
                      {formatDate(pm.joinedDate)}
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`${styles.statusBadge} ${
                          pm.status === "Active"
                            ? styles.statusActive
                            : styles.statusPending
                        }`}
                      >
                        {pm.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionsContainer}>
                        <button
                          onClick={() => handleMessage(pm.id)}
                          className={styles.actionButton}
                          disabled={startingConversationId === pm.id}
                        >
                          <MessageApp />
                        </button>
                        <button
                          onClick={() => handleViewProfile(pm.id)}
                          className={styles.actionButton}
                        >
                          <PrdView />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Card View */}
        {filteredPMs.length > 0 && (
          <div className={styles.cardsContainer}>
            {filteredPMs.map((pm) => (
              <div key={pm.id} className={styles.card}>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Client Name</span>
                  <div className={styles.cardNameValue}>
                    <div className={styles.avatar}>{getInitials(pm.name)}</div>
                    <span className={styles.pmName}>{pm.name}</span>
                  </div>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Email address</span>
                  <span className={styles.cardValue}>{pm.email}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Phone Number</span>
                  <span className={styles.cardValue}>{pm.phoneNumber}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Joined date</span>
                  <span className={styles.cardValue}>
                    {formatDate(pm.joinedDate)}
                  </span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Status</span>
                  <span
                    className={`${styles.statusBadge} ${
                      pm.status === "Active"
                        ? styles.statusActive
                        : styles.statusPending
                    }`}
                  >
                    {pm.status}
                  </span>
                </div>
                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleMessage(pm.id)}
                    className={styles.messageButton}
                    disabled={startingConversationId === pm.id}
                  >
                    <MessageApp />
                    {startingConversationId === pm.id
                      ? "Starting..."
                      : "Message"}
                  </button>
                  <button
                    onClick={() => handleViewProfile(pm.id)}
                    className={styles.viewProfileButton}
                  >
                    <Profile />
                    View profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPMs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredPMs.length / 10)}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AllProductManagersPage;
