"use client";
import { useState } from "react";
import styles from "./styles.module.css";

import { subscriptionPlans } from "@/utils/settingsTab";
import SubscriptionCard from "../subscriptionCard";
import PlanCard from "../planCard";
import Crown from "@/svgs/crown";

interface Subscription {
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
}

const BillingTab: React.FC = () => {
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>({
      planName: "Starter plan",
      price: 49000,
      duration: "1-month access",
      startDate: "12/11/2023",
      nextBillingDate: "1/01/2024",
      prdGenerated: 0,
      clients: 0,
      pms: 0,
      maxPrd: 20,
      maxClients: 20,
      maxPms: 20,
    });

  const handleChoosePlan = async (planId: string) => {
    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        console.log("Plan selected:", planId);
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
    }
  };

  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      try {
        const response = await fetch("/api/subscription", {
          method: "DELETE",
        });

        if (response.ok) {
          setActiveSubscription(null);
          console.log("Subscription cancelled");
        }
      } catch (error) {
        console.error("Error cancelling subscription:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.subscriptionSection}>
        <h2 className={styles.sectionTitle}>Active subscription</h2>
        {activeSubscription ? (
          <SubscriptionCard
            subscription={activeSubscription}
            onCancel={handleCancelSubscription}
          />
        ) : (
          <div className={styles.noSubscription}>
            <span className={styles.crownIcon}>
              <Crown />
            </span>
            <h3 className={styles.noSubTitle}>No Active Plan Yet</h3>
            <p className={styles.noSubText}>Choose a plan to get started</p>
          </div>
        )}
      </section>

      <section className={styles.plansSection}>
        <h2 className={styles.sectionTitle}>Plans</h2>
        <p className={styles.sectionSubtitle}>Choose Your Subscription plan</p>
        <div className={styles.plansGrid}>
          {subscriptionPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onChoose={() => handleChoosePlan(plan.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BillingTab;
