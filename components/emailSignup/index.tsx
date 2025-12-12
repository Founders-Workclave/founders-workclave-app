"use client";
import Link from "next/link";
import styles from "./styles.module.css";
import TestimonialSlider from "../testimonialSlider";
import Back from "@/svgs/back";
import { useRouter } from "next/navigation";
import { SignupFormData } from "@/utils/data";
import Google from "@/svgs/google";
import SignupFormAgency from "../signupForm";

const EmailSignupComp = () => {
  const router = useRouter();
  const handleSignup = (data: SignupFormData) => {
    console.log("User registered:", data);
  };
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
          <SignupFormAgency userType="Agency" onSubmit={handleSignup} />
          <div className={styles.dividerAlt}>
            <span>OR</span>
          </div>
          <div className={styles.loginBtn}>
            <Link href="#" className={styles.actionBtn}>
              <Google />
              Continue with Google
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSignupComp;
