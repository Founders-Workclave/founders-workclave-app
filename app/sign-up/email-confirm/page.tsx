import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import EmailBig from "@/svgs/emailBig";

const MailConfirm = () => {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.contain}>
          <Image
            src="/assets/logo-new.png"
            width={107}
            height={32}
            alt="logo"
          />
          <div className={styles.otherTexts}>
            <EmailBig />
            <h2>You’ve got a mail!</h2>
            <p>
              We just emailed a confirmation link to
              einstein.oyakhilome@yahoo.com.
            </p>
            <p>Click the link, and you’ll be signed in.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailConfirm;
