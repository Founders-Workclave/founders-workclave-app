import Mark from "@/svgs/mark";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";

const Done = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <Image src="/assets/logo-new.png" width={107} height={32} alt="logo" />
        <div className={styles.otherTexts}>
          <Mark />
          <h2>Your password has been reset!</h2>
          <p>
            This is the password you should enter when next you’re logging in to
            your Founder’s workshop dashboard
          </p>
          <Link href="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Done;
