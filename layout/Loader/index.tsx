import React from "react";
import styles from "./styles.module.css";
import Loader from "@/components/loader";

type AllLoadingProps = {
  loading?: boolean;
  text?: string;
};

const AllLoading = ({
  loading = true,
  text = "Loading...",
}: AllLoadingProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <Loader type="pulse" loading={loading} size={15} color="#5865F2" />
        <p>{text}</p>
      </div>
    </div>
  );
};

export default AllLoading;
