"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import NotificationNew from "@/svgs/notificationNew";
import Notification from "@/svgs/notification";

export interface Notification {
  id: string;
  type:
    | "milestone"
    | "document"
    | "payment"
    | "prd"
    | "wallet"
    | "consultation";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  amount?: number;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "milestone":
        return <NotificationNew />;
      case "document":
        return <NotificationNew />;
      case "payment":
      case "wallet":
        return <NotificationNew />;
      case "prd":
        return <NotificationNew />;
      case "consultation":
        return <NotificationNew />;
      default:
        return <NotificationNew />;
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Notification />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {isMobile && (
            <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          )}
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <h3 className={styles.dropdownTitle}>Notifications</h3>
              <div className={styles.headerActions}>
                {unreadCount > 0 && onMarkAllAsRead && (
                  <button
                    className={styles.markAllButton}
                    onClick={onMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
                {isMobile && (
                  <button
                    className={styles.closeButton}
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className={styles.notificationsList}>
              {notifications.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      !notification.isRead ? styles.unread : ""
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className={styles.iconWrapper}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className={styles.notificationContent}>
                      <h4 className={styles.notificationTitle}>
                        {notification.title}
                      </h4>
                      <p className={styles.notificationDescription}>
                        {notification.description}
                      </p>
                      <span className={styles.notificationTime}>
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsDropdown;
