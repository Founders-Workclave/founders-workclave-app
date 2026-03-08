"use client";

import styles from "./styles.module.css";

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
}

export default function ComingSoon({
  title = "Coming Soon",
  subtitle = "We're working on something great. Check back soon.",
  badgeText = "In progress",
}: ComingSoonProps) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          {badgeText}
        </div>

        <h1 className={styles.headline}>{title}</h1>

        <p className={styles.subtext}>{subtitle}</p>

        <div className={styles.dots}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
