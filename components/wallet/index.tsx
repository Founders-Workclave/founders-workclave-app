"use client";
import React, { useState } from "react";

import walletData from "../../mocks/walletData.json";
import styles from "./styles.module.css";
import WalletBalanceCard from "./walletBalanceCard";
import TransactionItem from "./transactionItem";
import FundWalletModal from "./fundwalletModal";
import TransactionHistory from "@/svgs/transactionHistory";

interface PageProps {
  params: {
    userId: string;
  };
}

const WalletPage = ({}: PageProps) => {
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTransactions = walletData.transactions.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.type.toLowerCase().includes(searchLower) ||
      transaction.reference.toLowerCase().includes(searchLower) ||
      transaction.status.toLowerCase().includes(searchLower) ||
      transaction.description?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleFundWithFlutterwave = (amount: number) => {
    console.log("Fund with Flutterwave:", amount);
    // Implement Flutterwave integration
  };

  const handleFundWithPaystack = (amount: number) => {
    console.log("Fund with Paystack:", amount);
    // Implement Paystack integration
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 6;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.container}>
      <WalletBalanceCard
        balance={walletData.walletBalance}
        currency={walletData.currency}
        onFundWallet={() => setIsFundModalOpen(true)}
      />

      <div className={styles.transactionsSection}>
        <h2 className={styles.sectionTitle}>Transaction history</h2>

        {walletData.transactions.length > 0 ? (
          <>
            <div className={styles.searchWrapper}>
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
            </div>

            <div className={styles.transactionsList}>
              {currentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  currency={walletData.currency}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>

                <div className={styles.pageNumbers}>
                  {renderPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className={styles.ellipsis}
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`${styles.pageButton} ${
                          currentPage === page ? styles.pageButtonActive : ""
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <div className={styles.navButtons}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.navButton}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.navButton}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <TransactionHistory />
            </div>
            <p className={styles.emptyText}>
              Recent Transactions will be displayed here
            </p>
          </div>
        )}
      </div>

      <FundWalletModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        onFundWithFlutterwave={handleFundWithFlutterwave}
        onFundWithPaystack={handleFundWithPaystack}
      />
    </div>
  );
};

export default WalletPage;
