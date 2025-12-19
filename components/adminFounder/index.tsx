"use client";
import React, { useState } from "react";
import userData from "../../mocks/userData.json";
import UsersTable from "../adminDashboard/userTable";
import UserProfile from "../adminUserProfile";
import styles from "./styles.module.css";

const AdminFounderComp: React.FC = () => {
  const [currentView, setCurrentView] = useState<"table" | "profile">("table");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the selected user data
  const selectedUser = selectedUserId
    ? userData.users.find((user) => user.id === selectedUserId)
    : null;

  const filteredUsers = userData.users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.agency.toLowerCase().includes(query) ||
      user.phone.includes(query)
    );
  }) as typeof userData.users;

  // Handle user selection - navigate to profile
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView("profile");
  };

  // Handle back to table view
  const handleBackToTable = () => {
    setCurrentView("table");
    setSelectedUserId(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className={styles.container}>
      {currentView === "table" && (
        <UsersTable
          users={filteredUsers}
          currentPage={currentPage}
          totalPages={30}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onUserSelect={handleUserSelect}
          title="All Users"
        />
      )}

      {currentView === "profile" && selectedUser && (
        <UserProfile
          user={
            selectedUser as typeof selectedUser & { role: "Founder" | "Agency" }
          }
          onBack={handleBackToTable}
        />
      )}
    </div>
  );
};

export default AdminFounderComp;
