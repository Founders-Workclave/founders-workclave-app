import Crown from "@/svgs/crown";
import styles from "./styles.module.css";

interface SubscriptionCardProps {
  subscription: {
    planName: string;
    price: number;
    duration: string;
    startDate: string;
    nextBillingDate: string;
    prdGenerated: number;
    clients: number;
    pms: number;
    maxPrd: number;
    maxClients: number;
    maxPms: number;
  };
  onCancel: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onCancel,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>
          <Crown />
        </span>
      </div>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3 className={styles.planName}>{subscription.planName}</h3>
          <p className={styles.duration}>{subscription.duration}</p>
        </div>
        <div className={styles.priceWrapper}>
          <span className={styles.price}>
            ₦{subscription.price.toLocaleString()}
          </span>
          <span className={styles.period}>/month</span>
          <p className={styles.date}>{subscription.startDate}</p>
        </div>
      </div>

      <div className={styles.billingAlert}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 6V10M10 14H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
        </svg>
        <span>Your next billing date is on {subscription.nextBillingDate}</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <p className={styles.statLabel}>PRD Generated</p>
          <p className={styles.statValue}>
            {subscription.prdGenerated}/{subscription.maxPrd}
          </p>
        </div>
        <div className={styles.statItem}>
          <p className={styles.statLabel}>Clients</p>
          <p className={styles.statValue}>
            {subscription.clients}/{subscription.maxClients}
          </p>
        </div>
        <div className={styles.statItem}>
          <p className={styles.statLabel}>PM&apos;s</p>
          <p className={styles.statValue}>
            {subscription.pms}/{subscription.maxPms}
          </p>
        </div>
      </div>

      <button className={styles.cancelButton} onClick={onCancel}>
        Cancel subscription
      </button>
    </div>
  );
};

export default SubscriptionCard;
