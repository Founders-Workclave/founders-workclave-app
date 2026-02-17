import React from "react";
import styles from "./styles.module.css";

const MessageSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      {/* Received Message Skeleton */}
      <div className={styles.messageSkeletonWrapper}>
        <div className={styles.skeletonAvatar}></div>
        <div className={styles.skeletonBubbleReceived}>
          <div className={styles.skeletonLine} style={{ width: "80%" }}></div>
          <div className={styles.skeletonLine} style={{ width: "60%" }}></div>
          <div className={styles.skeletonTime}></div>
        </div>
      </div>

      {/* Sent Message Skeleton */}
      <div className={styles.messageSkeletonWrapperSent}>
        <div className={styles.skeletonBubbleSent}>
          <div className={styles.skeletonLine} style={{ width: "70%" }}></div>
          <div className={styles.skeletonLine} style={{ width: "50%" }}></div>
          <div className={styles.skeletonTime}></div>
        </div>
      </div>

      {/* Another Received Message */}
      <div className={styles.messageSkeletonWrapper}>
        <div className={styles.skeletonAvatar}></div>
        <div className={styles.skeletonBubbleReceived}>
          <div className={styles.skeletonLine} style={{ width: "90%" }}></div>
          <div className={styles.skeletonTime}></div>
        </div>
      </div>

      {/* Another Sent Message */}
      <div className={styles.messageSkeletonWrapperSent}>
        <div className={styles.skeletonBubbleSent}>
          <div className={styles.skeletonLine} style={{ width: "85%" }}></div>
          <div className={styles.skeletonLine} style={{ width: "40%" }}></div>
          <div className={styles.skeletonTime}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
