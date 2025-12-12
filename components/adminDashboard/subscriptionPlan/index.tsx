import React from "react";
import styles from "./styles.module.css";

interface Plan {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

interface SubscriptionPlansProps {
  plans: Plan[];
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ plans }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Subscription Plans</h3>

      <div className={styles.plansList}>
        {plans.map((plan, index) => (
          <div key={index} className={styles.planItem}>
            <div className={styles.planInfo}>
              <span className={styles.planName}>{plan.name}</span>
              <span className={styles.planCount}>{plan.count}</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{
                  width: `${plan.percentage}%`,
                  backgroundColor: plan.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
