"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectsCount: number;
  joinedDate: string;
  status: "Active" | "Inactive";
}

interface ProductManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  projectsCount: number;
  joinedDate: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

export interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: "Starter" | "Professional" | "Enterprise";
  clients?: Client[];
  productManagers?: ProductManager[];
  pms: number; // Product Managers count
  mrr: number; // Monthly Recurring Revenue
  joinedDate: string;
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
}

interface AgenciesTableProps {
  agencies: Agency[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onAgencySelect?: (agencyId: string) => void;
}

const AgenciesTable: React.FC<AgenciesTableProps> = ({
  agencies = [],
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onAgencySelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  // Early return if no agencies
  if (!agencies || agencies.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>All Agencies</h3>
        </div>
        <div className={styles.emptyState}>
          <p>No agencies found.</p>
        </div>
      </div>
    );
  }

  const getClientsCount = (agency: Agency): number => {
    return agency.clients?.length || 0;
  };

  const getPMsCount = (agency: Agency): number => {
    return agency.productManagers?.length || agency.pms || 0;
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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Starter":
        return "#3B82F6"; // Blue
      case "Professional":
        return "#8B5CF6"; // Purple
      case "Enterprise":
        return "#F59E0B"; // Amber
      default:
        return "#6b7280";
    }
  };

  const toggleCard = (agencyId: string) => {
    setExpandedCardId(expandedCardId === agencyId ? null : agencyId);
    setOpenActionMenuId(null);
  };

  const toggleActionMenu = (agencyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === agencyId ? null : agencyId);
  };

  const handleAction = (action: string, agencyId: string) => {
    console.log(`${action} agency:`, agencyId);
    setOpenActionMenuId(null);

    switch (action) {
      case "See Details":
        if (onAgencySelect) {
          onAgencySelect(agencyId);
        }
        break;

      case "Deactivate":
        console.log("Deactivating agency:", agencyId);
        break;

      case "Reactivate":
        console.log("Reactivating agency:", agencyId);
        break;

      case "Delete":
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this agency?"
        );
        if (confirmDelete) {
          console.log("Deleting agency:", agencyId);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>All Agencies</h3>
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
            placeholder="Search agencies..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Agency</th>
              <th>Phone Number</th>
              <th>Plan</th>
              <th>Clients</th>
              <th>PM&apos;s</th>
              <th>MRR</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.id}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.avatar}>
                      {agency.avatar ? (
                        <Image
                          src={agency.avatar}
                          alt={agency.name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <span>{agency.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className={styles.userName}>{agency.name}</p>
                      <p className={styles.userEmail}>{agency.email}</p>
                    </div>
                  </div>
                </td>
                <td>{agency.phone}</td>
                <td>
                  <span
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: `${getPlanColor(agency.plan)}20`,
                      color: getPlanColor(agency.plan),
                    }}
                  >
                    {agency.plan}
                  </span>
                </td>
                <td>{getClientsCount(agency)}</td>
                <td>{getPMsCount(agency)}</td>
                <td>{formatCurrency(agency.mrr)}</td>
                <td>{agency.joinedDate}</td>
                <td>
                  <span
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: `${getStatusColor(agency.status)}20`,
                      color: getStatusColor(agency.status),
                    }}
                  >
                    {agency.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionWrapper}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => toggleActionMenu(agency.id, e)}
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

                    {openActionMenuId === agency.id && (
                      <div className={styles.actionMenu}>
                        <button
                          onClick={() => handleAction("See Details", agency.id)}
                        >
                          See Details
                        </button>
                        <button
                          onClick={() =>
                            handleAction(
                              agency.status === "Active"
                                ? "Deactivate"
                                : "Reactivate",
                              agency.id
                            )
                          }
                        >
                          {agency.status === "Active"
                            ? "Deactivate Agency"
                            : "Reactivate Agency"}
                        </button>
                        <button
                          onClick={() => handleAction("Delete", agency.id)}
                          className={styles.deleteAction}
                        >
                          Delete Agency
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className={styles.mobileCards}>
          {agencies.map((agency) => (
            <div key={agency.id} className={styles.mobileCard}>
              <div
                className={styles.mobileCardHeader}
                onClick={() => toggleCard(agency.id)}
              >
                <div className={styles.avatar}>
                  {agency.avatar ? (
                    <Image
                      src={agency.avatar}
                      alt={agency.name}
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span>{agency.name.charAt(0)}</span>
                  )}
                </div>
                <div className={styles.mobileCardContent}>
                  <h4 className={styles.mobileCardName}>{agency.name}</h4>
                  <p className={styles.mobileCardEmail}>{agency.email}</p>
                </div>
                <svg
                  className={`${styles.expandIcon} ${
                    expandedCardId === agency.id ? styles.expanded : ""
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

              {expandedCardId === agency.id && (
                <div className={styles.mobileCardDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Phone Number</span>
                    <span className={styles.detailValue}>{agency.phone}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Plan</span>
                    <span
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: `${getPlanColor(agency.plan)}20`,
                        color: getPlanColor(agency.plan),
                      }}
                    >
                      {agency.plan}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Clients</span>
                    <span className={styles.detailValue}>
                      {getClientsCount(agency)}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>PM&apos;s</span>
                    <span className={styles.detailValue}>
                      {getPMsCount(agency)}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>MRR</span>
                    <span className={styles.detailValue}>
                      {formatCurrency(agency.mrr)}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Joined Date</span>
                    <span className={styles.detailValue}>
                      {agency.joinedDate}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Status</span>
                    <span
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: `${getStatusColor(agency.status)}20`,
                        color: getStatusColor(agency.status),
                      }}
                    >
                      {agency.status}
                    </span>
                  </div>

                  <div className={styles.mobileActions}>
                    <button
                      className={styles.mobileActionButton}
                      onClick={() => handleAction("See Details", agency.id)}
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
                          agency.status === "Active"
                            ? "Deactivate"
                            : "Reactivate",
                          agency.id
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
                      {agency.status === "Active" ? "Deactivate" : "Reactivate"}
                    </button>
                    <button
                      className={`${styles.mobileActionButton} ${styles.deleteButton}`}
                      onClick={() => handleAction("Delete", agency.id)}
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
          ))}
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
            >
              {page}
            </button>
          ))}
        </div>
        <div className={styles.navButtons}>
          <button
            className={styles.navButton}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
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
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
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
    </div>
  );
};

export default AgenciesTable;
