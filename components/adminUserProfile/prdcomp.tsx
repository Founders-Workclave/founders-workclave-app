import React, { useState } from "react";
import styles from "./styles.module.css";
import EmptyPrd from "@/svgs/emptyprd";
import PRDCard from "../prd/prdCard";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  joinedDate: string;
  role: "Founder" | "Agency";
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  prds: PRD[];
}

export interface PRD {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  createdDate: string;
  lastModified: string;
  status: "Draft" | "Review" | "Approved" | "Published";
  description?: string;
  duration?: string;
  prdUrl?: string;
}

interface UserProfileProps {
  user: UserProfileData;
  onBack: () => void;
}

const PrdComp: React.FC<UserProfileProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Convert PRD data to match PRDCard interface
  const convertPRDToCardFormat = (prd: PRD) => {
    console.log("Original PRD data:", prd);

    // Map status to match PRDCard's expected format
    const getCardStatus = (status: string): "In-Progress" | "Completed" => {
      if (status === "Published" || status === "Approved") {
        return "Completed";
      }
      return "In-Progress";
    };

    // Calculate duration (you can customize this logic)
    const calculateDuration = (createdDate: string, lastModified: string) => {
      const created = new Date(createdDate);
      const modified = new Date(lastModified);
      const diffTime = Math.abs(modified.getTime() - created.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    };

    const converted = {
      id: parseInt(prd.id) || 0,
      projectName: prd.projectName || prd.title,
      description: prd.description || `PRD for ${prd.projectName || prd.title}`,
      createdDate: prd.createdDate,
      duration:
        prd.duration || calculateDuration(prd.createdDate, prd.lastModified),
      status: getCardStatus(prd.status),
      modifiedDate: prd.lastModified,
      prdUrl: prd.prdUrl || "#",
      documentUrl: prd.prdUrl || "#",
      uploadedAt: prd.createdDate,
    };

    console.log("Converted PRD data:", converted);
    return converted;
  };

  // Filter PRDs based on search query with null safety
  const filteredPRDs = user.prds.filter((prd) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (prd.title?.toLowerCase() || "").includes(searchLower) ||
      (prd.projectName?.toLowerCase() || "").includes(searchLower) ||
      (prd.status?.toLowerCase() || "").includes(searchLower) ||
      (prd.description?.toLowerCase() || "").includes(searchLower)
    );
  });

  const handleView = (id: number) => {
    const prd = user.prds.find((p) => parseInt(p.id) === id);
    if (prd && prd.prdUrl) {
      window.open(prd.prdUrl, "_blank");
    }
    // Navigate to PRD detail page or open modal
  };

  const handleEdit = (id: number) => {
    console.log("Editing PRD:", id);
    // Navigate to PRD edit page
  };

  const handleDownload = (id: number) => {
    console.log("Downloading PRD:", id);
    const prd = user.prds.find((p) => parseInt(p.id) === id);
    if (prd && prd.prdUrl) {
      const link = window.document.createElement("a");
      link.href = prd.prdUrl;
      link.download = `${prd.title}-PRD.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  return (
    <div className={styles.prdContainer}>
      <div className={styles.prdHeader}>
        <h1 className={styles.prdTitle}>Recent PRD</h1>
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
          {filteredPRDs.map((prd) => {
            const converted = convertPRDToCardFormat(prd);
            return (
              <div key={prd.id}>
                <PRDCard
                  prd={converted}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDownload={handleDownload}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <EmptyPrd />
          <h2 className={styles.emptyTitle}>
            {searchQuery ? "No PRDs Found" : "No PRD Generated Yet!"}
          </h2>
          <p className={styles.emptyText}>
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start your first project to bring your ideas to life"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PrdComp;
