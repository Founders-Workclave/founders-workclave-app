"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import PRDCard from "./prdCard";
import EmptyPrd from "@/svgs/emptyprd";
import { PRDService, PRD } from "@/lib/api/prdService";
import Loader from "../loader";

const PRDPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [prds, setPRDs] = useState<PRD[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPRDs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await PRDService.getAllUserPRDs();
        setPRDs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load PRDs");
        console.error("Error fetching PRDs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPRDs();
  }, []);

  // Filter PRDs based on search query
  const filteredPRDs = prds.filter((prd) => {
    const searchLower = searchQuery.toLowerCase();
    const projectName = prd.projectName || "";
    const description = prd.description || "";
    const filename = PRDService.getFilenameFromUrl(prd.documentUrl);

    return (
      projectName.toLowerCase().includes(searchLower) ||
      description.toLowerCase().includes(searchLower) ||
      filename.toLowerCase().includes(searchLower)
    );
  });

  const handleView = (prdId: number) => {
    const prd = prds.find((p) => p.id === prdId);
    if (prd) {
      window.open(prd.documentUrl, "_blank");
    }
  };

  const handleEdit = (prdId: number) => {
    console.log("Edit PRD:", prdId);
    // TODO: Implement edit functionality
  };

  const handleDownload = (prdId: number) => {
    const prd = prds.find((p) => p.id === prdId);
    if (prd) {
      const filename = prd.projectName
        ? `${prd.projectName}-PRD.pdf`
        : `${PRDService.getFilenameFromUrl(prd.documentUrl)}.pdf`;
      PRDService.downloadPRD(prd.documentUrl, filename);
    }
  };

  const handleStartConsultation = () => {
    console.log("Start AI consultation");
    // TODO: Navigate to consultation page
    window.location.href = "/consultation";
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
          <p>Loading PRDs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h3>Error loading PRDs</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recent PRD</h1>
      </div>

      {/* Search Bar */}
      {prds.length > 0 && (
        <div className={styles.searchWrapper}>
          <div className={styles.searchContainer}>
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
              placeholder="Search PRDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={styles.clearButton}
                aria-label="Clear search"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PRD List or Empty State */}
      {filteredPRDs.length > 0 ? (
        <div className={styles.prdList}>
          {filteredPRDs.map((prd) => (
            <PRDCard
              key={prd.id}
              prd={prd}
              onView={handleView}
              onEdit={handleEdit}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : prds.length > 0 && searchQuery ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            No PRDs found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <EmptyPrd />
          <h2 className={styles.emptyTitle}>No PRD Generated Yet!</h2>
          <p className={styles.emptyText}>
            Start your first project to bring your ideas to life
          </p>
          <button
            onClick={handleStartConsultation}
            className={styles.startButton}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Start AI consultation
          </button>
        </div>
      )}
    </div>
  );
};

export default PRDPage;
