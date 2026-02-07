"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { clientMenuItems } from "@/utils/data";
import Link from "next/link";
import HeaderNotification from "@/components/notificationDropdown/notificationComp";
import {
  isAuthenticated,
  getUser,
  getUserDisplayName,
  getUserInitials,
} from "@/lib/api/auth";

interface ClientLayoutProps {
  pageTitle: string;
  pageText: string;
  children?: React.ReactNode;
  projectId?: string;
  userId?: string;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({
  children,
  pageTitle,
  pageText,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const menu = clientMenuItems;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      console.log("❌ User not authenticated, redirecting to login");
      router.replace("/login");
      return;
    }

    const user = getUser();
    console.log("🔍 ClientLayout - Checking user authorization:", {
      role: user?.role,
      userType: user?.userType,
    });

    // Check if user has Client role or userType
    const isClient =
      user?.role === "clients" || user?.userType?.toLowerCase() === "client";
    const isPM = user?.role === "manager";

    if (!isClient && !isPM) {
      console.log("❌ User is not a Client or PM, access denied");
      console.log("Current user type:", user?.userType, "role:", user?.role);
      router.replace("/unauthorized");
      return;
    }

    console.log("✅ Client user authenticated and authorized");
  }, [router]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check authentication status
  if (!isAuthenticated()) {
    return null;
  }

  const user = getUser();
  const isClient =
    user?.role === "clients" || user?.userType?.toLowerCase() === "client";
  const isPM = user?.role === "manager";

  // Don't render content until authorization is confirmed
  if (!isClient && !isPM) {
    return null;
  }

  const displayName = getUserDisplayName();
  const initials = getUserInitials();

  return (
    <div className={styles.container}>
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <div
        className={`${styles.colOne} ${
          isMobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <div className={styles.logoWrapper}>
          <Image src="/assets/logo.png" width={107} height={32} alt="logo" />
          <button className={styles.closeMenuBtn} onClick={closeMobileMenu}>
            ✕
          </button>
        </div>
        <div className={styles.menuLists}>
          <div className={styles.menuGroup1}>
            <h4>Overview</h4>
            <div className={styles.linkContain}>
              {menu.slice(0, 2).map((items, index) => {
                return (
                  <div
                    key={index}
                    className={`${styles.menuListing} ${
                      items.link === pathname ? styles.active : ""
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {items.icon}
                    <Link href={items.link}>{items.label}</Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.menuGroup1}>
            <h4>Financial</h4>
            <div className={styles.linkContain}>
              {menu.slice(2, 4).map((items, index) => {
                return (
                  <div
                    key={index}
                    className={`${styles.menuListing} ${
                      pathname.startsWith(items.link) ? styles.active : ""
                    }`}
                  >
                    {items.icon}
                    <Link href={items.link}>{items.label}</Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.menuGroup1}>
            <h4>Support</h4>
            {menu.slice(4, 6).map((items, index) => {
              return (
                <div
                  key={index}
                  className={`${styles.menuListing} ${
                    items.link === pathname ? styles.active : ""
                  }`}
                >
                  {items.icon}
                  <Link href={items.link}>{items.label}</Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.colTwo}>
        <div className={styles.topNav}>
          <Image
            src="/assets/logo.png"
            width={107}
            height={32}
            alt="logo"
            className={styles.mobileLogo}
          />
          <div className={styles.navText}>
            <h2>{pageTitle}</h2>
            <Image
              src="/assets/logo.png"
              width={107}
              height={32}
              alt="logo"
              className={styles.mobileLogo}
            />
            <p>{pageText}</p>
          </div>
          <div className={styles.otherNavItems}>
            <HeaderNotification />
            <div className={styles.profileSection}>
              <div className={styles.profilePlaceholder}>{initials}</div>
              <p>{displayName}</p>
            </div>
          </div>
          <button
            className={styles.mobileMenuBtn}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className={styles.pageDetails}>
          <div className={styles.pageHeader}>
            <h2>{pageTitle}</h2>
            <p>{pageText}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
