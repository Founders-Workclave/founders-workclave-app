"use client";
import React, { useState } from "react";
import mockData from "../../mocks/agencyPrd.json";
import styles from "./styles.module.css";
import { Pagination } from "../agencyProject/pagination";
import PrdView from "@/svgs/prdView";
import PrdDownload from "@/svgs/prdDownload";
import PrdDelete from "@/svgs/prdDelete";
import DownloadPrd from "@/svgs/downloadPrd";

type FilterTab = "all" | "in-progress" | "completed";

interface Client {
  name: string;
  id: string;
}

interface PRD {
  id: string;
  prdDetails: string;
  client: Client;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PRDListResponse {
  prds: PRD[];
  totalPages: number;
  currentPage: number;
  totalPRDs: number;
  perPage: number;
}

const AllPRDsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(3);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  const data = mockData as PRDListResponse;

  const filteredPRDs = data.prds.filter((prd) => {
    const matchesSearch =
      prd.prdDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prd.client.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Convert status to lowercase string for comparison
    const statusLower = String(prd.status).toLowerCase();

    const matchesFilter =
      filterTab === "all" ||
      (filterTab === "in-progress" &&
        (statusLower === "in-progress" || statusLower === "in progress")) ||
      (filterTab === "completed" && statusLower === "completed");

    return matchesSearch && matchesFilter;
  });

  const handleView = (prdId: string): void => {
    console.log("View PRD:", prdId);
    // Navigation logic here
  };

  const handleDownload = (prdId: string): void => {
    console.log("Download PRD:", prdId);
    // Download logic here
  };

  const handleDelete = (prdId: string): void => {
    console.log("Delete PRD:", prdId);
    // Delete logic here
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
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
          onClick={() => setFilterTab("in-progress")}
          className={`${styles.tab} ${
            filterTab === "in-progress" ? styles.tabActive : ""
          }`}
        >
          In-Progress
        </button>
        <button
          onClick={() => setFilterTab("completed")}
          className={`${styles.tab} ${
            filterTab === "completed" ? styles.tabActive : ""
          }`}
        >
          Completed
        </button>
      </div>

      {/* PRDs Container */}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All PRDs</h1>
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

        {/* Desktop Table View */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableHeaderCell}>PRD details</th>
                <th className={styles.tableHeaderCell}>Client</th>
                <th className={styles.tableHeaderCell}>Status</th>
                <th className={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPRDs.map((prd) => (
                <tr key={prd.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{prd.prdDetails}</td>
                  <td className={styles.tableCell}>{prd.client.name}</td>
                  <td className={styles.tableCell}>
                    <span
                      className={`${styles.statusBadge} ${
                        prd.status === "In-Progress"
                          ? styles.statusInProgress
                          : styles.statusCompleted
                      }`}
                    >
                      {prd.status}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionsContainer}>
                      <button
                        onClick={() => handleView(prd.id)}
                        className={styles.actionButton}
                        aria-label="View PRD"
                      >
                        <PrdView />
                      </button>
                      <button
                        onClick={() => handleDownload(prd.id)}
                        className={styles.actionButton}
                        aria-label="Download PRD"
                      >
                        <DownloadPrd />
                      </button>
                      <button
                        onClick={() => handleDelete(prd.id)}
                        className={styles.actionButton}
                        aria-label="Delete PRD"
                      >
                        <PrdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className={styles.cardsContainer}>
          {filteredPRDs.map((prd) => (
            <div key={prd.id} className={styles.card}>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>PRD details</span>
                <span className={styles.cardValue}>{prd.prdDetails}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Client</span>
                <span className={styles.cardValue}>{prd.client.name}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Status</span>
                <span
                  className={`${styles.statusBadge} ${
                    prd.status === "In-Progress"
                      ? styles.statusInProgress
                      : styles.statusCompleted
                  }`}
                >
                  {prd.status}
                </span>
              </div>
              <div className={styles.cardActions}>
                <button
                  onClick={() => handleView(prd.id)}
                  className={styles.actionButton}
                  aria-label="View PRD"
                >
                  <PrdView />
                </button>
                <button
                  onClick={() => handleDownload(prd.id)}
                  className={styles.actionButton}
                  aria-label="Download PRD"
                >
                  <PrdDownload />
                </button>
                <button
                  onClick={() => handleDelete(prd.id)}
                  className={styles.actionButton}
                  aria-label="Delete PRD"
                >
                  <PrdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AllPRDsPage;
