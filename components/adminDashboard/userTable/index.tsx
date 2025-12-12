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
}

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#10b981";
      case "Inactive":
        return "#f59e0b";
      case "Suspended":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Users</h3>
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
            {users.map((user) => (
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
                  <button className={styles.actionButton}>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <div className={styles.pageButtons}>
          {[1, 2, 3, 4, 5, 6].map((page) => (
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
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
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
