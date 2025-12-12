"use client";
import React, { useState } from "react";
import adminData from "@/mocks/adminData.json";
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

export default function AdminDashboard() {
  const [users, setUsers] = useState(adminData.users);
  const [currentPage, setCurrentPage] = useState(
    adminData.pagination.currentPage
  );

  const handleSearch = (query: string) => {
    const filtered = adminData.users.filter(
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

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {adminData.stats.map((stat) => (
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
          totalRevenue={adminData.revenueData.total}
        />
        <SubscriptionPlans plans={adminData.subscriptionPlans} />
      </div>

      <UsersTable
        users={users as User[]}
        currentPage={currentPage}
        totalPages={adminData.pagination.totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </div>
  );
}
