"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import PaymentMobileCard from "./paymentMobile";
import PaymentTableRow from "./paymentTableRow";
import {
  paymentService,
  ApiError,
} from "@/lib/api/agencyService/paymentService";
import AllLoading from "@/layout/Loader";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

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
  clientName?: string;
}

const ITEMS_PER_PAGE = 5;

const AllAgencyPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await paymentService.getPayments();
        const transformedPayments: Payment[] = response.paymentHistory.map(
          (payment, index) => ({
            id: index + 1,
            transactionId: payment.transactionID,
            date: payment.paymentDate
              ? new Date(payment.paymentDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : null,
            projectName: payment.projectName,
            milestoneNumber: 0,
            milestoneTitle: "",
            progress: {
              current: 0,
              total: 100,
              percentage: payment.progressPercentage,
            },
            amount: parseFloat(payment.amount.replace(/,/g, "")),
            currency: "NGN",
            percentagePaid: payment.percentagePaid,
            status:
              payment.status === "ongoing"
                ? "in-progress"
                : (payment.status as "completed" | "pending"),
            paymentMethod: null,
            paymentDate: payment.paymentDate,
            clientName: payment.clientName,
          })
        );

        setPayments(transformedPayments);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching payments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      payment.transactionId.toLowerCase().includes(searchLower) ||
      payment.projectName.toLowerCase().includes(searchLower) ||
      payment.milestoneTitle.toLowerCase().includes(searchLower) ||
      payment.status.toLowerCase().includes(searchLower) ||
      payment.clientName?.toLowerCase().includes(searchLower)
    );
  });
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <AllLoading text="Loading payments..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load payments"
        message="We're having trouble loading your payments. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

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

      {filteredPayments.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <p>No payments found</p>
        </div>
      )}
    </div>
  );
};

export default AllAgencyPayments;
