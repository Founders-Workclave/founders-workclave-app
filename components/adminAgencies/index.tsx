"use client";
import React, { useState } from "react";
import userData from "../../mocks/userData.json";
import AgencyProfile from "../agencyProfile";
import styles from "./styles.module.css";
import AgenciesTable from "../agenciesTable";
import type { UserData, Agency } from "../../types/user"; // Import types

const AdminAgencyComp: React.FC = () => {
  const [currentView, setCurrentView] = useState<"table" | "profile">("table");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Type assertion for userData
  const typedUserData = userData as UserData;

  // Filter only agencies from the userData
  const agencies = typedUserData.users.filter(
    (user): user is Agency => user.role === "Agency"
  );

  // Get the selected user data
  const selectedUser = selectedUserId
    ? agencies.find((user) => user.id === selectedUserId)
    : null;

  // Filter agencies based on search query
  const filteredAgencies = agencies.filter((agency) => {
    const query = searchQuery.toLowerCase();
    return (
      agency.name.toLowerCase().includes(query) ||
      agency.email.toLowerCase().includes(query) ||
      agency.phone.includes(query) ||
      (agency.agency && agency.agency.toLowerCase().includes(query))
    );
  });

  // Handle agency selection - navigate to profile
  const handleAgencySelect = (agencyId: string) => {
    setSelectedUserId(agencyId);
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
        <AgenciesTable
          agencies={filteredAgencies}
          currentPage={currentPage}
          totalPages={30}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onAgencySelect={handleAgencySelect}
        />
      )}

      {currentView === "profile" && selectedUser && (
        <AgencyProfile agency={selectedUser} onBack={handleBackToTable} />
      )}
    </div>
  );
};

export default AdminAgencyComp;
