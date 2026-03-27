import { SettingsTab } from "@/components/agencySettings";

export interface TabData {
  id: SettingsTab;
  label: string;
}

export const tabsData: TabData[] = [
  { id: "profile", label: "Profile" },
  { id: "payouts", label: "Payouts" },
  { id: "billing", label: "Billing" },
  { id: "reset-password", label: "Reset password" },
  { id: "help-center", label: "Help center" },
];

// data/banks.ts
export const banksData = [
  { value: "access-bank", label: "Access Bank" },
  { value: "united-bank-for-africa", label: "United Bank for Africa" },
  { value: "first-bank-of-nigeria", label: "First Bank of Nigeria" },
  { value: "first-city-monument-bank", label: "First City Monument Bank" },
  { value: "zenith-bank", label: "Zenith Bank" },
  { value: "fidelity-bank", label: "Fidelity Bank" },
  { value: "unity-bank", label: "Unity Bank" },
  { value: "union-bank", label: "Union Bank" },
  { value: "premiumtrust-bank", label: "PremiumTrust Bank" },
  { value: "guaranty-trust-bank", label: "Guaranty Trust Bank" },
  { value: "sterling-bank", label: "Sterling Bank" },
  { value: "stanbic-ibtc-bank", label: "Stanbic IBTC Bank" },
  { value: "ecobank-plc", label: "Ecobank Plc" },
  { value: "wema-bank", label: "Wema Bank" },
  { value: "polaris-bank", label: "Polaris Bank" },
  { value: "keystone-bank", label: "Keystone Bank" },
];

// data/subscriptionPlans.ts
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic-1",
    name: "Basic plan",
    price: 14000,
    features: [
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
    ],
  },
  {
    id: "basic-2",
    name: "Basic plan",
    price: 14000,
    features: [
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
    ],
  },
  {
    id: "basic-3",
    name: "Basic plan",
    price: 14000,
    features: [
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
      "Lorem ipsum",
    ],
  },
];
