import styles from "./styles.module.css";
import Image from "next/image";
import PasswordReset from "@/components/passwordReset/reset";

const ResetPassword = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <Image src="/assets/logo-new.png" width={107} height={32} alt="logo" />
        <PasswordReset />
      </div>
    </div>
  );
};

export default ResetPassword;
