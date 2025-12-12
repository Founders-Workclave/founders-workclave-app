"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";

interface RevenueData {
  day: string;
  amount: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  totalRevenue: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, totalRevenue }) => {
  const [timeFilter, setTimeFilter] = useState("all");

  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Total Revenue</h3>
          <p className={styles.amount}>{totalRevenue}</p>
        </div>
        <select
          className={styles.filterSelect}
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="all">All time</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="year">This year</option>
        </select>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          <span>100M</span>
          <span>80M</span>
          <span>60M</span>
          <span>40M</span>
          <span>10M</span>
          <span>0</span>
        </div>

        <div className={styles.chart}>
          {data.map((item, index) => (
            <div key={index} className={styles.barWrapper}>
              <div
                className={styles.bar}
                style={{ height: `${(item.amount / maxAmount) * 100}%` }}
              />
              <span className={styles.label}>{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
