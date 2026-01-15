"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import HeaderNotification from "@/components/notificationDropdown/notificationComp";
import { superAdminMenuItems } from "@/utils/data";
import { getCurrentUser, isAdmin, isAuthenticated } from "@/lib/api/auth";
import toast from "react-hot-toast";

interface AdminLayoutProps {
  pageTitle: string;
  children?: React.ReactNode;
  projectId?: string;
  userId?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get current user on mount
  const currentUser = getCurrentUser();

  // Check authorization status - computed, not stored in state
  const isAuthorized = isAuthenticated() && isAdmin();

  // Check authentication and authorization
  useEffect(() => {
    console.log("🔍 Admin Layout - Checking auth:", {
      isAuth: isAuthenticated(),
      isAdminUser: isAdmin(),
      user: getCurrentUser(),
    });

    if (!isAuthenticated()) {
      console.log("❌ Not authenticated, redirecting to login");
      toast.error("Please log in to access admin area");
      router.replace("/login?redirect=/admin");
      return;
    }

    if (!isAdmin()) {
      console.log("❌ Not admin, redirecting to dashboard");
      toast.error("Access denied. Admin privileges required.");

      const user = getCurrentUser();
      if (user) {
        const username =
          user.username || user.name.toLowerCase().replace(/\s+/g, ".");
        router.replace(`/${username}`);
      } else {
        router.replace("/login");
      }
      return;
    }

    console.log("✅ Admin access granted");
  }, [router]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Show nothing while checking auth
  if (!isAuthorized) {
    return null;
  }

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
              {superAdminMenuItems.slice(0, 4).map((items, index) => {
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
              {superAdminMenuItems.slice(4, 5).map((items, index) => {
                return (
                  <div
                    key={index}
                    className={`${styles.menuListing} ${
                      pathname.startsWith(items.link) ? styles.active : ""
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
            <h4>Support</h4>
            {superAdminMenuItems.slice(5, 7).map((items, index) => {
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
          </div>
          <div className={styles.otherNavItems}>
            <HeaderNotification />
            <div className={styles.profileSection}>
              {currentUser?.name ? (
                <div className={styles.profilePlaceholder}>
                  {currentUser.name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")}
                </div>
              ) : (
                <div className={styles.profilePlaceholder}>A</div>
              )}
              <p>{currentUser?.name || "Admin"}</p>
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
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
