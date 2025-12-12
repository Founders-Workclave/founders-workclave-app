"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import paymentsDataRaw from "../../mocks/payments.json";
import PaymentMobileCard from "./paymentMobile";
import PaymentTableRow from "./paymentTableRow";

interface Payment {
  id: number;
  transactionId: string;
  date: string | null;
  projectName: string;
  milestoneNumber: number;
  milestoneTitle: string;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  amount: number;
  currency: string;
  percentagePaid: number;
  status: "completed" | "in-progress" | "pending";
  paymentMethod: string | null;
  paymentDate: string | null;
}

interface PaymentsData {
  userId: string;
  projectId: number;
  projectTitle: string;
  totalMilestones: number;
  completedMilestones: number;
  payments: Payment[];
}

const ITEMS_PER_PAGE = 5;

const AllPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const paymentsData = paymentsDataRaw as PaymentsData;

  // Check if mobile on mount
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter payments based on search
  const filteredPayments = paymentsData.payments.filter((payment) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      payment.transactionId.toLowerCase().includes(searchLower) ||
      payment.projectName.toLowerCase().includes(searchLower) ||
      payment.milestoneTitle.toLowerCase().includes(searchLower) ||
      payment.status.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSeeDetails = (paymentId: number) => {
    console.log("View payment details:", paymentId);
    // Navigate to payment details page or open modal
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>All payments</h1>
      </div>

      <div className={styles.searchBar}>
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
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {isMobile ? (
        // Mobile Card View
        <div className={styles.mobileCards}>
          {currentPayments.map((payment) => (
            <PaymentMobileCard
              key={payment.id}
              payment={payment}
              onSeeDetails={handleSeeDetails}
            />
          ))}
        </div>
      ) : (
        // Desktop Table View
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Project name</th>
                <th>Progress</th>
                <th>Amount paid</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment) => (
                <PaymentTableRow
                  key={payment.id}
                  payment={payment}
                  onSeeDetails={handleSeeDetails}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <div className={styles.pageButtons}>
            {[...Array(Math.min(6, totalPages))].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.pageButton} ${
                    currentPage === page ? styles.activePageButton : ""
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <div className={styles.navButtons}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.navButton}
            >
              ‹
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.navButton}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {filteredPayments.length === 0 && (
        <div className={styles.emptyState}>
          <p>No payments found</p>
        </div>
      )}
    </div>
  );
};

export default AllPayments;
