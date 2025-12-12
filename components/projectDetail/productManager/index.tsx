// components/projectDetail/ProductManager.tsx
import React from "react";
import styles from "./styles.module.css";
import MessageApp from "@/svgs/messageApp";

interface ManagerData {
  name: string;
  initials: string;
  avatar: string | null;
}

interface ProductManagerProps {
  manager: ManagerData;
  onMessagePM: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({
  manager,
  onMessagePM,
}) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Product Manager</h3>

      <div className={styles.managerInfo}>
        {manager.avatar ? (
          <div>
            <h2>EO</h2>
          </div>
        ) : (
          <div className={styles.avatarPlaceholder}>{manager.initials}</div>
        )}
        <p className={styles.name}>{manager.name}</p>
      </div>

      <button onClick={onMessagePM} className={styles.messageButton}>
        <MessageApp />
        Message PM
      </button>
    </div>
  );
};

export default ProductManager;
