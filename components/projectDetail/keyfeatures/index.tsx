import React from "react";
import styles from "./styles.module.css";
import FeatureItem from "@/svgs/featureItem";

interface KeyFeaturesProps {
  features: string[];
}

const KeyFeatures: React.FC<KeyFeaturesProps> = ({ features }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Key Features</h2>
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureItem}>
            <FeatureItem />
            <span className={styles.featureText}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyFeatures;
