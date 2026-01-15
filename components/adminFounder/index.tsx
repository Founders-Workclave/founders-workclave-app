"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import FoundersTable from "../foundersTable";
import UserProfile from "../adminUserProfile";
import {
  fetchFounders,
  fetchFounderById,
  updateFounderStatus,
  deleteFounder,
} from "../../lib/api/foundersTable";
import type { Founder } from "@/types/founder";
import Loader from "../loader";

const AdminFounderComp: React.FC = () => {
  const [currentView, setCurrentView] = useState<"table" | "profile">("table");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserData, setSelectedUserData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [founders, setFounders] = useState<Founder[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const loadFounders = async () => {
      setLoading(true);
      setError(null);

      const result = await fetchFounders({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
      });

      if (result.success) {
        setFounders(result.founders);
        setTotalPages(result.totalPages);
      } else {
        setError(result.message);
        setFounders([]);
      }

      setLoading(false);
    };

    loadFounders();
  }, [currentPage, searchQuery]);

  const handleFounderSelect = async (founderId: string) => {
    console.log("🔍 See Details founder:", founderId);

    // First, check what founder data we have in the table
    const founderFromTable = founders.find((f) => f.id === founderId);
    console.log("📋 Founder from table:", founderFromTable);

    setSelectedUserId(founderId);
    setProfileLoading(true);
    setCurrentView("profile");

    // Fetch detailed founder data with projects
    const result = await fetchFounderById(founderId);

    console.log("📊 Fetch result:", result); // Debug log

    if (result.success && result.founder) {
      const userData = {
        ...result.founder,
        role: "Founder" as const,
        projects: result.projects || [],
        prds: [], // Add PRDs when endpoint is available
      };

      console.log("👤 Setting user data:", userData); // Debug log
      setSelectedUserData(userData);
    } else {
      console.error("❌ Failed to fetch founder details:", result.error);
      // Fallback to basic founder data from table
      const basicFounder = founders.find((f) => f.id === founderId);
      if (basicFounder) {
        console.log("⚠️ Using fallback data from table");
        setSelectedUserData({
          ...basicFounder,
          role: "Founder" as const,
          projects: [],
          prds: [],
        });
      }
    }

    setProfileLoading(false);
  };

  const handleBackToTable = () => {
    setCurrentView("table");
    setSelectedUserId(null);
    setSelectedUserData(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (
    founderId: string,
    currentStatus: string
  ) => {
    const newActiveStatus = currentStatus !== "Active";

    const result = await updateFounderStatus(founderId, newActiveStatus);

    if (result.success) {
      // Refresh the founders list
      setCurrentPage((prev) => prev);
      alert(result.message);

      // If viewing this user's profile, update the profile data
      if (selectedUserId === founderId && selectedUserData) {
        setSelectedUserData({
          ...selectedUserData,
          status: newActiveStatus ? "Active" : "Inactive",
        });
      }
    } else {
      alert(`Failed: ${result.message}`);
    }
  };

  const handleDelete = async (founderId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this founder? This action cannot be undone."
    );

    if (!confirmDelete) return;

    const result = await deleteFounder(founderId);

    if (result.success) {
      // If viewing the deleted user's profile, go back to table
      if (selectedUserId === founderId) {
        handleBackToTable();
      }

      setCurrentPage(1);
      alert(result.message);
    } else {
      alert(`Failed: ${result.message}`);
    }
  };

  const handleRetry = () => {
    setCurrentPage((prev) => prev);
  };

  if (loading && founders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader type="pulse" loading={loading} size={15} color="#5865F2" />
          <p>Loading Founders...</p>
        </div>
      </div>
    );
  }

  if (error && founders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={handleRetry} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {currentView === "table" && (
        <FoundersTable
          founders={founders}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFounderSelect={handleFounderSelect}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      {currentView === "profile" && (
        <>
          {profileLoading ? (
            <div className={styles.loadingContainer}>
              <Loader type="pulse" loading={true} size={15} color="#5865F2" />
              <p>Loading Profile...</p>
            </div>
          ) : selectedUserData ? (
            <UserProfile
              user={selectedUserData}
              onBack={handleBackToTable}
              onDeactivate={handleStatusUpdate}
            />
          ) : (
            <div className={styles.errorState}>
              <p>Failed to load user profile</p>
              <button
                onClick={handleBackToTable}
                className={styles.retryButton}
              >
                Back to Table
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminFounderComp;
