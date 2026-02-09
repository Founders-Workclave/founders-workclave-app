"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import type { Founder } from "@/types/founder";

interface FoundersTableProps {
  founders: Founder[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onFounderSelect?: (founderId: string) => void;
  onStatusUpdate?: (founderId: string, currentStatus: string) => void;
  onDelete?: (founderId: string) => void;
  loading?: boolean;
}

const FoundersTable: React.FC<FoundersTableProps> = ({
  founders,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onFounderSelect,
  onStatusUpdate,
  onDelete,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#00B049";
      case "Inactive":
        return "#7B580C";
      case "Suspended":
        return "#EB5757";
      default:
        return "#6b7280";
    }
  };

  // Helper function to safely get founder ID
  const getFounderId = (founder: Founder): string => {
    return founder.id || founder.founderID || founder.email || "";
  };

  const toggleCard = (founderId: string) => {
    setExpandedCardId(expandedCardId === founderId ? null : founderId);
    setOpenActionMenuId(null);
  };

  const toggleActionMenu = (founderId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (openActionMenuId === founderId) {
      setOpenActionMenuId(null);
    } else {
      setOpenActionMenuId(founderId);

      // Position the menu above the button
      setTimeout(() => {
        const button = e.currentTarget as HTMLElement;
        const menu = button.parentElement?.querySelector(
          `.${styles.actionMenu}`
        ) as HTMLElement;

        if (menu && button) {
          const buttonRect = button.getBoundingClientRect();
          menu.style.top = `${buttonRect.top - menu.offsetHeight - 8}px`;
          menu.style.left = `${
            buttonRect.left - menu.offsetWidth + button.offsetWidth
          }px`;
        }
      }, 0);
    }
  };

  const handleAction = (action: string, founder: Founder) => {
    const founderId = getFounderId(founder);
    console.log(`${action} founder:`, founderId);
    setOpenActionMenuId(null);

    switch (action) {
      case "See Details":
        if (onFounderSelect) {
          onFounderSelect(founderId);
        }
        break;

      case "Deactivate":
      case "Reactivate":
        if (onStatusUpdate) {
          onStatusUpdate(founderId, founder.status);
        }
        break;

      case "Delete":
        if (onDelete) {
          onDelete(founderId);
        }
        break;

      default:
        console.log("Unknown action:", action);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 6;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, 6);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 5; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
          currentPage + 3
        );
      }
    }

    return pages;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>All Founders</h3>
        <div className={styles.searchWrapper}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search founders..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
            disabled={loading}
          />
        </div>
      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {!loading && founders.length === 0 && (
        <div className={styles.emptyState}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          <p>No founders found</p>
          {searchQuery && (
            <p className={styles.emptySubtext}>
              Try adjusting your search criteria
            </p>
          )}
        </div>
      )}

      {!loading && founders.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Projects</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {founders.map((founder) => {
                  const founderId = getFounderId(founder);
                  return (
                    <tr key={founderId}>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.avatar}>
                            {founder.avatar ? (
                              <Image
                                src={founder.avatar}
                                alt={founder.name}
                                width={40}
                                height={40}
                              />
                            ) : (
                              <span>
                                {founder.firstName?.[0] ||
                                  founder.name?.charAt(0) ||
                                  "F"}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className={styles.userName}>
                              {founder.name || "N/A"}
                            </p>
                            <p className={styles.userEmail}>
                              {founder.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{founder.phone || "N/A"}</td>
                      <td>{founder.projectsCount || 0}</td>
                      <td>{founder.joinedDate || "N/A"}</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: `${getStatusColor(
                              founder.status
                            )}20`,
                            color: getStatusColor(founder.status),
                          }}
                        >
                          {founder.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionWrapper}>
                          <button
                            className={styles.actionButton}
                            onClick={(e) => toggleActionMenu(founderId, e)}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </button>

                          {openActionMenuId === founderId && (
                            <div className={styles.actionMenu}>
                              <button
                                onClick={() =>
                                  handleAction("See Details", founder)
                                }
                              >
                                See Details
                              </button>
                              <button
                                onClick={() =>
                                  handleAction(
                                    founder.status === "Active"
                                      ? "Deactivate"
                                      : "Reactivate",
                                    founder
                                  )
                                }
                              >
                                {founder.status === "Active"
                                  ? "Deactivate Founder"
                                  : "Reactivate Founder"}
                              </button>
                              <button
                                onClick={() => handleAction("Delete", founder)}
                                className={styles.deleteAction}
                              >
                                Delete Founder
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className={styles.mobileCards}>
              {founders.map((founder) => {
                const founderId = getFounderId(founder);
                return (
                  <div key={founderId} className={styles.mobileCard}>
                    <div
                      className={styles.mobileCardHeader}
                      onClick={() => toggleCard(founderId)}
                    >
                      <div className={styles.avatar}>
                        {founder.avatar ? (
                          <Image
                            src={founder.avatar}
                            alt={founder.name}
                            width={48}
                            height={48}
                          />
                        ) : (
                          <span>
                            {founder.firstName?.[0] ||
                              founder.name?.charAt(0) ||
                              "F"}
                          </span>
                        )}
                      </div>
                      <div className={styles.mobileCardContent}>
                        <h4 className={styles.mobileCardName}>
                          {founder.name || "N/A"}
                        </h4>
                        <p className={styles.mobileCardEmail}>
                          {founder.email || "N/A"}
                        </p>
                      </div>
                      <svg
                        className={`${styles.expandIcon} ${
                          expandedCardId === founderId ? styles.expanded : ""
                        }`}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>

                    {expandedCardId === founderId && (
                      <div className={styles.mobileCardDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>
                            Phone Number
                          </span>
                          <span className={styles.detailValue}>
                            {founder.phone || "N/A"}
                          </span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Projects</span>
                          <span className={styles.detailValue}>
                            {founder.projectsCount || 0}
                          </span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>
                            Joined Date
                          </span>
                          <span className={styles.detailValue}>
                            {founder.joinedDate || "N/A"}
                          </span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Status</span>
                          <span
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: `${getStatusColor(
                                founder.status
                              )}20`,
                              color: getStatusColor(founder.status),
                            }}
                          >
                            {founder.status}
                          </span>
                        </div>

                        <div className={styles.mobileActions}>
                          <button
                            className={styles.mobileActionButton}
                            onClick={() => handleAction("See Details", founder)}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            Details
                          </button>
                          <button
                            className={styles.mobileActionButton}
                            onClick={() =>
                              handleAction(
                                founder.status === "Active"
                                  ? "Deactivate"
                                  : "Reactivate",
                                founder
                              )
                            }
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 3l18 18M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                            {founder.status === "Active"
                              ? "Deactivate"
                              : "Reactivate"}
                          </button>
                          <button
                            className={`${styles.mobileActionButton} ${styles.deleteButton}`}
                            onClick={() => handleAction("Delete", founder)}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.pagination}>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <div className={styles.pageButtons}>
              {renderPageNumbers().map((page) => (
                <button
                  key={page}
                  className={`${styles.pageButton} ${
                    page === currentPage ? styles.active : ""
                  }`}
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                >
                  {page}
                </button>
              ))}
            </div>
            <div className={styles.navButtons}>
              <button
                className={styles.navButton}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className={styles.navButton}
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || loading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FoundersTable;
