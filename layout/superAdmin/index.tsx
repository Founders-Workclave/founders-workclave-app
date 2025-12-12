"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import HeaderNotification from "@/components/notificationDropdown/notificationComp";
import { superAdminMenuItems } from "@/utils/data";

interface FounderLayoutProps {
  pageTitle: string;
  children?: React.ReactNode;
  projectId?: string;
  userId?: string;
}

const AdminLayout: React.FC<FounderLayoutProps> = ({ children, pageTitle }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
              <Image
                src="/assets/profile.png"
                width={32}
                height={32}
                alt="profile"
              />
              <p>Waden Warren</p>
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
