"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Pagination } from "../agencyProject/pagination";
import PrdView from "@/svgs/prdView";
import PrdDownload from "@/svgs/prdDownload";
import PrdDelete from "@/svgs/prdDelete";
import DownloadPrd from "@/svgs/downloadPrd";
import { agencyService } from "@/lib/api/agencyService/agencyService";
import type { PRD } from "@/types/allAgencyPrd";
import AllLoading from "@/layout/Loader";
import EmptyPrd from "@/svgs/emptyprd";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

type FilterTab = "all" | "in-progress" | "completed";

const AllPRDsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [prds, setPrds] = useState<PRD[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

  const fetchPRDs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await agencyService.getAllPRDs();
      setPrds(response.prds);
    } catch (err) {
      console.error("Error fetching PRDs:", err);
      setError("Failed to load PRDs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPRDs();
  }, []);

  const filteredPRDs = prds.filter((prd) => {
    const matchesSearch =
      prd.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prd.client.toLowerCase().includes(searchQuery.toLowerCase());

    const statusLower = prd.status.toLowerCase();

    const matchesFilter =
      filterTab === "all" ||
      (filterTab === "in-progress" &&
        (statusLower === "in-progress" || statusLower === "in progress")) ||
      (filterTab === "completed" && statusLower === "completed");

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPRDs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPRDs = filteredPRDs.slice(startIndex, endIndex);

  const handleView = (documentUrl: string): void => {
    window.open(documentUrl, "_blank");
  };

  const handleDownload = (documentUrl: string, projectName: string): void => {
    const link = document.createElement("a");
    link.href = documentUrl;
    link.download = `${projectName}_PRD.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (prd: PRD): void => {
    console.log("Delete PRD:", prd);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <AllLoading text="Loading PRDs..." />
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load PRDs"
        message="We're having trouble loading your PRDs. Please try again."
        showRetry
        onRetry={fetchPRDs}
      />
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.tabsContainer}>
        <button
          onClick={() => {
            setFilterTab("all");
            setCurrentPage(1);
          }}
          className={`${styles.tab} ${
            filterTab === "all" ? styles.tabActive : ""
          }`}
        >
          All
        </button>
        <button
          onClick={() => {
            setFilterTab("in-progress");
            setCurrentPage(1);
          }}
          className={`${styles.tab} ${
            filterTab === "in-progress" ? styles.tabActive : ""
          }`}
        >
          In-Progress
        </button>
        <button
          onClick={() => {
            setFilterTab("completed");
            setCurrentPage(1);
          }}
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
            placeholder="Search by project or client name"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {currentPRDs.length === 0 ? (
          <div className={styles.emptyState}>
            <EmptyPrd />
            <p>No PRDs found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHeader}>
                    <th className={styles.tableHeaderCell}>Project</th>
                    <th className={styles.tableHeaderCell}>Client</th>
                    <th className={styles.tableHeaderCell}>Status</th>
                    <th className={styles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPRDs.map((prd, index) => (
                    <tr
                      key={`${prd.project}-${index}`}
                      className={styles.tableRow}
                    >
                      <td className={styles.tableCell}>{prd.project}</td>
                      <td className={styles.tableCell}>{prd.client}</td>
                      <td className={styles.tableCell}>
                        <span
                          className={`${styles.statusBadge} ${
                            prd.status.toLowerCase() === "completed"
                              ? styles.statusCompleted
                              : styles.statusInProgress
                          }`}
                        >
                          {prd.status === "in-progress"
                            ? "In-Progress"
                            : "Completed"}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.actionsContainer}>
                          <button
                            onClick={() => handleView(prd.document)}
                            className={styles.actionButton}
                            aria-label="View PRD"
                            title="View PRD"
                          >
                            <PrdView />
                          </button>
                          <button
                            onClick={() =>
                              handleDownload(prd.document, prd.project)
                            }
                            className={styles.actionButton}
                            aria-label="Download PRD"
                            title="Download PRD"
                          >
                            <DownloadPrd />
                          </button>
                          <button
                            onClick={() => handleDelete(prd)}
                            className={styles.actionButton}
                            aria-label="Delete PRD"
                            title="Delete PRD"
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
              {currentPRDs.map((prd, index) => (
                <div key={`${prd.project}-${index}`} className={styles.card}>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Project</span>
                    <span className={styles.cardValue}>{prd.project}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Client</span>
                    <span className={styles.cardValue}>{prd.client}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>Status</span>
                    <span
                      className={`${styles.statusBadge} ${
                        prd.status.toLowerCase() === "completed"
                          ? styles.statusCompleted
                          : styles.statusInProgress
                      }`}
                    >
                      {prd.status === "in-progress"
                        ? "In-Progress"
                        : "Completed"}
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => handleView(prd.document)}
                      className={styles.actionButton}
                      aria-label="View PRD"
                    >
                      <PrdView />
                    </button>
                    <button
                      onClick={() => handleDownload(prd.document, prd.project)}
                      className={styles.actionButton}
                      aria-label="Download PRD"
                    >
                      <PrdDownload />
                    </button>
                    <button
                      onClick={() => handleDelete(prd)}
                      className={styles.actionButton}
                      aria-label="Delete PRD"
                    >
                      <PrdDelete />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllPRDsPage;
