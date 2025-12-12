import Mark from "@/svgs/mark";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";

const DoneSignup = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <Image src="/assets/logo-new.png" width={107} height={32} alt="logo" />
        <div className={styles.otherTexts}>
          <Mark />
          <h2>Welcome to Founder’s workshop</h2>
          <p>
            Your account has been created successfully. Let’s get you started on
            your product journey.
          </p>
          <Link href="/dashboard" className={styles.dashboardBtn}>
            Go to Dashboard &rarr;
          </Link>
          <Link href="/" className={styles.Consultation}>
            Start AI Consultation Now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoneSignup;
