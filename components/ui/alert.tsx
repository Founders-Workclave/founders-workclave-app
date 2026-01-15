import React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { AlertProps } from "../../types/adminForms";
import styles from "./styles.module.css";

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div
      className={`${styles.alert} ${
        type === "success" ? styles.alertSuccess : styles.alertError
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className={styles.alertIcon} />
      ) : (
        <AlertCircle className={styles.alertIcon} />
      )}
      <div className={styles.alertContent}>
        <p className={styles.alertMessage}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={styles.alertClose}
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
