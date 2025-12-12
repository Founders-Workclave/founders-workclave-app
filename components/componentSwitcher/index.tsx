"use client";
import { useState } from "react";
import styles from "./styles.module.css";

interface TabComponent {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface ComponentSwitcherProps {
  tabs: TabComponent[];
  defaultTabId?: string;
}

const ComponentSwitcher: React.FC<ComponentSwitcherProps> = ({
  tabs,
  defaultTabId,
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || tabs[0].id
  );

  return (
    <div className={styles.container}>
      <div className={styles.tabButtons}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${
              tab.id === activeTabId ? styles.active : ""
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tabs.find((tab) => tab.id === activeTabId)?.component}
      </div>
    </div>
  );
};

export default ComponentSwitcher;
