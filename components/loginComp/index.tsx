import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import Google from "@/svgs/google";
import Facebook from "@/svgs/facebook";
import Ios from "@/svgs/ios";
import Email from "@/svgs/email";
import TestimonialSlider from "../testimonialSlider";

const LoginComp = () => {
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
          <p>Sign up with your favorite platform</p>
          <div className={styles.allBtn}>
            <div className={styles.loginBtn}>
              <Link href="#" className={styles.actionBtn}>
                <Google />
                Continue with Google
              </Link>
              <Link href="#" className={styles.actionBtn}>
                <Facebook />
                Continue with Facebook
              </Link>
              <Link href="#" className={styles.actionBtn}>
                <Ios />
                Continue with Apple
              </Link>
            </div>
            <div className={styles.dividerAlt}>
              <span>OR</span>
            </div>
            <div className={styles.loginBtn}>
              <Link href="/sign-up/email-signup" className={styles.actionBtn}>
                <Email />
                Continue with Email
              </Link>
            </div>
            <p className={styles.otherText}>
              By continuing, you agree to our{" "}
              <Link href="/login">Terms of Service</Link> and{" "}
              <Link href="/login">Privacy Policy</Link>
            </p>
            <p className={styles.otherText2}>
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComp;
