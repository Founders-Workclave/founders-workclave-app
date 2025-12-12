import React from "react";
import styles from "./styles.module.css";
import LoginForm from "../loginForm";
import TestimonialSlider from "../testimonialSlider";

const SignupEmail = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <div className={styles.colOne}>
          <TestimonialSlider />
        </div>
        <div className={styles.colTwo}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default SignupEmail;
