"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  joinedDate: string;
  role: "Founder" | "Agency";
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  title?: string;
}

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onUserSelect?: (userId: string) => void;
  title: string;
}

const USERS_PER_PAGE = 10;

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onUserSelect,
  title,
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

  const toggleCard = (userId: string) => {
    setExpandedCardId(expandedCardId === userId ? null : userId);
    setOpenActionMenuId(null);
  };

  const toggleActionMenu = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === userId ? null : userId);
  };

  const handleAction = (action: string, userId: string) => {
    console.log(`${action} user:`, userId);
    setOpenActionMenuId(null);

    switch (action) {
      case "See Details":
        if (onUserSelect) {
          onUserSelect(userId);
        }
        break;

      case "Deactivate":
        console.log("Deactivating user:", userId);
        break;

      case "Reactivate":
        console.log("Reactivating user:", userId);
        break;

      case "Delete":
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this user?"
        );
        if (confirmDelete) {
          console.log("Deleting user:", userId);
        }
        break;

      default:
        console.log("Unknown action:", action);
    }
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, endIndex);

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
        <h3 className={styles.title}>{title}</h3>
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
            placeholder="Search"
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
              <th>Name</th>
              <th>Phone Number</th>
              <th>Agency</th>
              <th>Joined Date</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.avatar}>
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <span>{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className={styles.userName}>{user.name}</p>
                      <p className={styles.userEmail}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>{user.phone}</td>
                <td>{user.agency}</td>
                <td>{user.joinedDate}</td>
                <td>
                  <span className={styles.roleBadge}>{user.role}</span>
                </td>
                <td>
                  <span
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: `${getStatusColor(user.status)}20`,
                      color: getStatusColor(user.status),
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionWrapper}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => toggleActionMenu(user.id, e)}
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

                    {openActionMenuId === user.id && (
                      <div className={styles.actionMenu}>
                        <button
                          onClick={() =>
                            handleAction(
                              user.status === "Active"
                                ? "Deactivate"
                                : "Reactivate",
                              user.id
                            )
                          }
                        >
                          {user.status === "Active"
                            ? "Deactivate User"
                            : "Reactivate User"}
                        </button>
                        <button
                          onClick={() => handleAction("Delete", user.id)}
                          className={styles.deleteAction}
                        >
                          Delete User
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
          {paginatedUsers.map((user) => (
            <div key={user.id} className={styles.mobileCard}>
              <div
                className={styles.mobileCardHeader}
                onClick={() => toggleCard(user.id)}
              >
                <div className={styles.avatar}>
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
                <div className={styles.mobileCardContent}>
                  <h4 className={styles.mobileCardName}>{user.name}</h4>
                  <p className={styles.mobileCardEmail}>{user.email}</p>
                </div>
                <svg
                  className={`${styles.expandIcon} ${
                    expandedCardId === user.id ? styles.expanded : ""
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

              {expandedCardId === user.id && (
                <div className={styles.mobileCardDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Phone Number</span>
                    <span className={styles.detailValue}>{user.phone}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Agency</span>
                    <span className={styles.detailValue}>{user.agency}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Joined Date</span>
                    <span className={styles.detailValue}>
                      {user.joinedDate}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Role</span>
                    <span className={styles.roleBadge}>{user.role}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Status</span>
                    <span
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: `${getStatusColor(user.status)}20`,
                        color: getStatusColor(user.status),
                      }}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className={styles.mobileActions}>
                    <button
                      className={styles.mobileActionButton}
                      onClick={() => handleAction("See Details", user.id)}
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
                          user.status === "Active"
                            ? "Deactivate"
                            : "Reactivate",
                          user.id
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
                      {user.status === "Active" ? "Deactivate" : "Reactivate"}
                    </button>
                    <button
                      className={`${styles.mobileActionButton} ${styles.deleteButton}`}
                      onClick={() => handleAction("Delete", user.id)}
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

export default UsersTable;
