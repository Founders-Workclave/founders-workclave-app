"use client";
import React, { useState } from "react";
import prdData from "@/mocks/prds.json";
import styles from "./styles.module.css";
import PRDCard from "./prdCard";
import EmptyPrd from "@/svgs/emptyprd";

interface PRD {
  id: number;
  projectName: string;
  description: string;
  createdDate: string;
  duration: string;
  status: "In-Progress" | "Completed";
  modifiedDate: string;
  prdUrl: string;
}

const PRDPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const prds = prdData.prds as PRD[];

  // Filter PRDs based on search query
  const filteredPRDs = prds.filter((prd) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      prd.projectName.toLowerCase().includes(searchLower) ||
      prd.description.toLowerCase().includes(searchLower) ||
      prd.status.toLowerCase().includes(searchLower)
    );
  });

  const handleView = (prdId: number) => {
    console.log("View PRD:", prdId);
    const prd = prds.find((p) => p.id === prdId);
    if (prd) {
      window.open(prd.prdUrl, "_blank");
    }
  };

  const handleEdit = (prdId: number) => {
    console.log("Edit PRD:", prdId);
    // Implement edit functionality
  };

  const handleDownload = (prdId: number) => {
    console.log("Download PRD:", prdId);
    const prd = prds.find((p) => p.id === prdId);
    if (prd) {
      const link = window.document.createElement("a");
      link.href = prd.prdUrl;
      link.download = `${prd.projectName}-PRD.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const handleStartConsultation = () => {
    console.log("Start AI consultation");
    // Navigate to consultation page or open modal
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recent PRD</h1>
      </div>

      {/* Search Bar */}
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
            placeholder="Search"
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
