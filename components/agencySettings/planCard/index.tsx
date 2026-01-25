import styles from "./styles.module.css";

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
  onChoose: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onChoose }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.price}>₦{plan.price.toLocaleString()}/mth</h3>
      <p className={styles.planName}>{plan.name}</p>

      <ul className={styles.features}>
        {plan.features.map((feature, index) => (
          <li key={index} className={styles.feature}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="9"
                stroke="#6366F1"
                strokeWidth="1.5"
              />
              <path
                d="M6 10L9 13L14 7"
                stroke="#6366F1"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className={styles.chooseButton} onClick={onChoose}>
        Choose Plan
      </button>
    </div>
  );
};

export default PlanCard;
