"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TestimonialSlider from "../testimonialSlider";
import Link from "next/link";
import FounderIcon from "@/svgs/founder";
import AgencyIcon from "@/svgs/agency";

type UserType = "founder" | "agency" | null;

const SignupComp = () => {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const router = useRouter();

  const handleProceed = () => {
    if (selectedType === "founder") {
      router.push("/sign-up/founder");
    } else if (selectedType === "agency") {
      router.push("/sign-up/agency");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <div className={styles.colOne}>
          <TestimonialSlider />
        </div>
        <div className={styles.colTwo}>
          <Image
            src="/assets/logo-new.png"
            width={107}
            height={32}
            alt="logo"
          />
          <h2>Get Started in Seconds</h2>
          <p>Select account type</p>
          <div className={styles.cardContainer}>
            {/* Founder Card */}
            <button
              onClick={() => setSelectedType("founder")}
              className={`${styles.card} ${
                selectedType === "founder" ? styles.selected : ""
              }`}
            >
              <div className={styles.iconWrapper}>
                <FounderIcon />
              </div>
              <h3 className={styles.cardTitle}>As A Founder</h3>
            </button>

            {/* Agency Card */}
            <button
              onClick={() => setSelectedType("agency")}
              className={`${styles.card} ${
                selectedType === "agency" ? styles.selected : ""
              }`}
            >
              <div className={styles.iconWrapper}>
                <AgencyIcon />
              </div>
              <h3 className={styles.cardTitle}>As An Agency</h3>
            </button>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!selectedType}
            className={styles.proceedButton}
          >
            Proceed
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Sign In Link */}
          <p className={styles.signInText}>
            Already have an account?{" "}
            <Link href="/login" className={styles.signInLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupComp;
