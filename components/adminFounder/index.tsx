"use client";
import React, { useState } from "react";
import userData from "../../mocks/userData.json";
import styles from "./styles.module.css";
import FoundersTable from "../foundersTable";
import UserProfile from "../adminUserProfile";
import type { UserData, Founder } from "../../types/user"; // Import types

const AdminFounderComp: React.FC = () => {
  const [currentView, setCurrentView] = useState<"table" | "profile">("table");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const typedUserData = userData as UserData;
  const founders = typedUserData.users.filter(
    (user): user is Founder => user.role === "Founder"
  );

  const selectedUser = selectedUserId
    ? founders.find((user) => user.id === selectedUserId)
    : null;

  const filteredFounders = founders.filter((founder) => {
    const query = searchQuery.toLowerCase();
    return (
      founder.name.toLowerCase().includes(query) ||
      founder.email.toLowerCase().includes(query) ||
      founder.phone.includes(query) ||
      (founder.agency && founder.agency.toLowerCase().includes(query))
    );
  });

  // Handle founder selection - navigate to profile
  const handleFounderSelect = (founderId: string) => {
    setSelectedUserId(founderId);
    setCurrentView("profile");
  };
  const handleBackToTable = () => {
    setCurrentView("table");
    setSelectedUserId(null);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      {currentView === "table" && (
        <FoundersTable
          founders={filteredFounders}
          currentPage={currentPage}
          totalPages={30}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onFounderSelect={handleFounderSelect}
        />
      )}

      {currentView === "profile" && selectedUser && (
        <UserProfile user={selectedUser} onBack={handleBackToTable} />
      )}
    </div>
  );
};

export default AdminFounderComp;
