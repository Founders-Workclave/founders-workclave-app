"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { founderMenuItems } from "@/utils/data";
import {
  isAuthenticated,
  getUser,
  getUserDisplayName,
  getUserInitials,
  getUserProfileImage,
} from "@/lib/api/auth";
import Link from "next/link";
import HeaderNotification from "@/components/notificationDropdown/notificationComp";

interface FounderLayoutProps {
  pageTitle: string;
  pageText: string;
  children?: React.ReactNode;
  projectId?: string;
  userId?: string;
}

const FounderLayout: React.FC<FounderLayoutProps> = ({
  children,
  pageTitle,
  pageText,
  projectId,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();
  const userId = user?.id ?? "";
  const menu = founderMenuItems(userId, projectId || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [initials, setInitials] = useState<string>("");

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = () => {
      setProfileImage(getUserProfileImage());
      setDisplayName(getUserDisplayName());
      setInitials(getUserInitials());
    };

    loadProfile();
  }, []);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileImage(getUserProfileImage());
      setDisplayName(getUserDisplayName());
      setInitials(getUserInitials());
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  // Auth + role check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const currentUser = getUser();
    const isFounder =
      currentUser?.userType?.toLowerCase() === "founder" ||
      currentUser?.role?.toLowerCase() === "user" ||
      currentUser?.role?.toLowerCase() === "founder";

    if (!isFounder) {
      router.replace("/unauthorized");
      return;
    }
  }, [router]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (!isAuthenticated()) return null;

  const currentUser = getUser();
  const isFounder =
    currentUser?.userType?.toLowerCase() === "founder" ||
    currentUser?.role?.toLowerCase() === "user" ||
    currentUser?.role?.toLowerCase() === "founder";

  if (!isFounder) return null;

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
              {menu.slice(0, 4).map((items, index) => (
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
              ))}
            </div>
          </div>
          <div className={styles.menuGroup1}>
            <h4>Financial</h4>
            <div className={styles.linkContain}>
              {menu.slice(4, 6).map((items, index) => (
                <div
                  key={index}
                  className={`${styles.menuListing} ${
                    pathname.startsWith(items.link) ? styles.active : ""
                  }`}
                >
                  {items.icon}
                  <Link href={items.link}>{items.label}</Link>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.menuGroup1}>
            <h4>Support</h4>
            {menu.slice(6, 9).map((items, index) => (
              <div
                key={index}
                className={`${styles.menuListing} ${
                  items.link === pathname ? styles.active : ""
                }`}
              >
                {items.icon}
                <Link href={items.link}>{items.label}</Link>
              </div>
            ))}
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
              {profileImage ? (
                <div className={styles.profileImageWrapper}>
                  <Image
                    src={profileImage}
                    width={40}
                    height={40}
                    alt={displayName || "Profile"}
                    className={styles.profileImage}
                  />
                </div>
              ) : (
                <div className={styles.profilePlaceholder}>{initials}</div>
              )}
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

export default FounderLayout;
