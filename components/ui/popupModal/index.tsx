import React from "react";
import { X } from "lucide-react";
import styles from "./styles.module.css";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

const PopupModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  width = "800px",
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          {title && <h2 className={styles.modalTitle}>{title}</h2>}
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

export default PopupModal;
