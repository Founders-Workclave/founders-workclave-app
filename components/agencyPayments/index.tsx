import styles from "./styles.module.css";

export default function AgencyPayments() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.summary}>
        <div className={styles.card}>
          <h3>$2,700</h3>
          <p>Total Project Value</p>
        </div>

        <div className={`${styles.card} ${styles.paid}`}>
          <h3>$800</h3>
          <p>Paid</p>
        </div>

        <div className={`${styles.card} ${styles.remaining}`}>
          <h3>$1,900</h3>
          <p>Remaining</p>
        </div>
      </div>

      {/* Payment history */}
      <div className={styles.history}>
        <h4>Payment history</h4>

        <div className={styles.list}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.item}>
              <div>
                <p className={styles.title}>
                  Milestone 1: Initial Consultation
                </p>
                <p className={styles.meta}>Sept 18, 2025 • Wallet</p>
              </div>

              <div className={styles.right}>
                <span className={styles.amount}>$500</span>
                <span className={styles.status}>Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
