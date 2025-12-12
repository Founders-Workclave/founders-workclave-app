import ResetComp from "@/components/resetPwdForm";
import styles from "./styles.module.css";
import Image from "next/image";

const ResetPassword = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <Image src="/assets/logo-new.png" width={107} height={32} alt="logo" />
        <ResetComp />
      </div>
    </div>
  );
};

export default ResetPassword;
