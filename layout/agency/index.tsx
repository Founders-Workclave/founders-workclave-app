"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { agencyMenuItems } from "@/utils/data";
import Link from "next/link";
import HeaderNotification from "@/components/notificationDropdown/notificationComp";
import {
  getCurrentUser,
  isAuthenticated,
  getUserInitials,
  getUserProfileImage,
} from "@/lib/api/auth";
import { profileService } from "@/lib/api/agencyService/profileService";

interface AgencyLayoutProps {
  pageTitle: string;
  pageText: string;
  children?: React.ReactNode;
  projectId?: string;
  userId?: string;
}

const AgencyLayout: React.FC<AgencyLayoutProps> = ({
  children,
  pageTitle,
  pageText,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const menu = agencyMenuItems;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setIsLoading] = useState(true);
  const [user, setUser] = useState(getCurrentUser());
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // ✅ Fetch full profile on mount to get companyLogo
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        await profileService.fetchUserProfile();
        setProfileImage(getUserProfileImage());
        setUser(getCurrentUser());
      } catch {
        // Fail silently — just use whatever is in storage
        setProfileImage(getUserProfileImage());
      }
    };

    loadProfileImage();
  }, []);

  useEffect(() => {
    const refreshProfile = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setProfileImage(getUserProfileImage());
      }
    };

    const handleProfileUpdate = () => {
      refreshProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("storage", refreshProfile);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("storage", refreshProfile);
    };
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.replace("/login");
        return;
      }

      const currentUser = getCurrentUser();

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      const userUserType = currentUser.userType?.toLowerCase();

      if (userUserType !== "agency") {
        if (currentUser.role === "admin") {
          router.replace("/admin");
        } else {
          const username =
            currentUser.username ||
            currentUser.name.toLowerCase().replace(/\s+/g, ".");
          router.replace(`/${username}`);
        }
        return;
      }

      setUser(currentUser);
      setProfileImage(getUserProfileImage());
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!user) {
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
              {menu.slice(0, 7).map((items, index) => {
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
              {menu.slice(7, 9).map((items, index) => {
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
            {menu.slice(9, 11).map((items, index) => {
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
                    alt={user?.name || "Profile"}
                    className={styles.profileImage}
                  />
                </div>
              ) : (
                <div className={styles.profilePlaceholder}>
                  {getUserInitials()}
                </div>
              )}
              <p>{user?.name || "Agency User"}</p>
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

export default AgencyLayout;
