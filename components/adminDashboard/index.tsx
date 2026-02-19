"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import UsersTable, { User } from "./userTable";
import SubscriptionPlans from "./subscriptionPlan";
import RevenueChart from "./revenueChart";
import StatsCard from "./statsCard";
import AdminFounder from "@/svgs/adminFounders";
import AdminAgencies from "@/svgs/adminAgencies";
import AdminRevenue from "@/svgs/adminRevenue";
import AdminPrds from "@/svgs/adminPrds";
import AdminProjects from "@/svgs/adminProjects";
import {
  getSuperAdminDashboard,
  DashboardData,
  RecentUser,
} from "@/lib/api/superAdmin/dashboardService";
import AllLoading from "@/layout/Loader";
import adminData from "@/mocks/adminData.json";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSuperAdminDashboard();
        setDashboardData(data);

        // Transform recent users to User format
        const transformedUsers: User[] = data.recentUsers.map(
          (user: RecentUser) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone || "N/A",
            agency: user.company || "N/A",
            joinedDate: new Date(user.dateJoined).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            role: user.role as "Founder" | "Agency",
            status: "Active" as const,
            avatar: undefined,
          })
        );

        setAllUsers(transformedUsers);
        setUsers(transformedUsers);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(errorMessage);
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    setUsers(filtered);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      users: <AdminFounder />,
      building: <AdminAgencies />,
      dollar: <AdminRevenue />,
      document: <AdminPrds />,
      folder: <AdminProjects />,
    };
    return icons[iconName] || null;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <AllLoading text="Loading Dashboard..." />
      </div>
    );
  }

  if (error) {
    <ServiceUnavailable
      title="Couldn't load Dashboard"
      message="We're having trouble loading your dashboard. Please try again."
      showRetry
      onRetry={() => window.location.reload()}
    />;
  }

  if (!dashboardData) {
    return null;
  }

  const stats = [
    {
      id: 1,
      icon: "users",
      label: "Total Founders",
      value: dashboardData.totalFounders.toString(),
      bgColor: "#EEF0FE",
    },
    {
      id: 2,
      icon: "building",
      label: "Total Agencies",
      value: dashboardData.totalAgencys.toString(),
      bgColor: "#FEF3E2",
    },
    {
      id: 3,
      icon: "dollar",
      label: "Month Revenue",
      value: `$${dashboardData.monthRevenue.toLocaleString()}`,
      bgColor: "#E7F8EE",
    },
    {
      id: 4,
      icon: "document",
      label: "Total PRDs",
      value: dashboardData.totalPRDS.toString(),
      bgColor: "#FEF2F3",
    },
    {
      id: 5,
      icon: "folder",
      label: "Active Projects",
      value: dashboardData.activeProject.toString(),
      bgColor: "#F4F3FF",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <StatsCard
            key={stat.id}
            icon={getIcon(stat.icon)}
            label={stat.label}
            value={stat.value}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <RevenueChart
          data={adminData.revenueData.chart}
          totalRevenue={`$${dashboardData.monthRevenue.toLocaleString()}`}
        />
        <SubscriptionPlans plans={adminData.subscriptionPlans} />
      </div>

      <UsersTable
        users={users}
        title="Recent Users"
        currentPage={currentPage}
        totalPages={Math.ceil(users.length / 10)}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </div>
  );
}
