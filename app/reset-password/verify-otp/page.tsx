import styles from "./styles.module.css";
import Image from "next/image";
import OTPVerification from "@/components/otpVerification/verify";

const VerifyEmail = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <Image src="/assets/logo-new.png" width={107} height={32} alt="logo" />
        <OTPVerification />
      </div>
    </div>
  );
};

export default VerifyEmail;
