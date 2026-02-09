"use client";
import React, { useState, useEffect } from "react";
import AgencyProfile from "../agencyProfile";
import styles from "./styles.module.css";
import AgenciesTable from "../agenciesTable";
import type { Agency } from "../../types/user";
import { getAllAgencies } from "@/lib/api/superAdmin/agencyService";
import AllLoading from "@/layout/Loader";

interface APIAgency {
  agencyID: string;
  company: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateJoined: string;
  active: boolean;
  clients: number;
  managers: number;
  revenue: string;
  prds: number;
}

const AdminAgencyComp: React.FC = () => {
  const [currentView, setCurrentView] = useState<"table" | "profile">("table");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch agencies from API
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setIsLoading(true);
        const response = await getAllAgencies();

        // Transform API response to Agency type
        const transformedAgencies: Agency[] = response.agencies.map(
          (agency: APIAgency) => ({
            id: agency.agencyID,
            name: `${agency.firstName} ${agency.lastName}`,
            email: agency.email,
            phone: agency.phone,
            agency: agency.company || "No Company",
            joinedDate: new Date(agency.dateJoined).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            ),
            role: "Agency" as const,
            status: agency.active ? "Active" : ("Inactive" as const),
            avatar: "",
            plan: "Professional" as const,
            pms: agency.managers,
            mrr: parseFloat(agency.revenue),
            projectsCount: 0,
          })
        );

        setAgencies(transformedAgencies);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch agencies";
        setError(errorMessage);
        console.error("Error fetching agencies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencies();
  }, []);

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
    setCurrentPage(1);
  };

  // Show error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <AllLoading text="Loading agencies..." />
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Show loading state in table
  if (isLoading && currentView === "table") {
    return (
      <div className={styles.container}>
        <AllLoading text="Loading agencies..." />
      </div>
    );
  }

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
