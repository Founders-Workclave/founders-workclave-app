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
  { value: "Access Bank", label: "Access Bank" },
  { value: "United Bank for Africa", label: "United Bank for Africa" },
  { value: "First Bank of Nigeria", label: "First Bank of Nigeria" },
  { value: "First City Monument Bank", label: "First City Monument Bank" },
  { value: "Zenith Bank", label: "Zenith Bank" },
  { value: "Fidelity Bank", label: "Fidelity Bank" },
  { value: "Unity Bank", label: "Unity Bank" },
  { value: "Union Bank", label: "Union Bank" },
  { value: "PremiumTrust Bank", label: "PremiumTrust Bank" },
  { value: "Guaranty Trust Bank", label: "Guaranty Trust Bank" },
  { value: "Sterling Bank", label: "Sterling Bank" },
  { value: "Stanbic IBTC Bank", label: "Stanbic IBTC Bank" },
  { value: "Ecobank Plc", label: "Ecobank Plc" },
  { value: "Wema Bank", label: "Wema Bank" },
  { value: "Polaris Bank", label: "Polaris Bank" },
  { value: "Keystone Bank", label: "Keystone Bank" },
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
