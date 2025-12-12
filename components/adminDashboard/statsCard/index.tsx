import React from "react";
import styles from "./styles.module.css";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>{icon}</div>
      <p className={styles.label}>{label}</p>
      <h3 className={styles.value}>{value}</h3>
    </div>
  );
};

export default StatsCard;
