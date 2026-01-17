"use client";
import React from "react";
import styles from "./styles.module.css";
import TestimonialSlider from "../testimonialSlider";
import Back from "@/svgs/back";
import { useRouter } from "next/navigation";
import SignupFormFounder from "../signupFormFounder";

const FounderComp = () => {
  const router = useRouter();
  const handleSignup = () => {};
  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <div className={styles.colOne}>
          <TestimonialSlider />
        </div>
        <div className={styles.colTwo}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <Back /> Back
          </button>
          <SignupFormFounder onSubmit={handleSignup} />
        </div>
      </div>
    </div>
  );
};

export default FounderComp;
