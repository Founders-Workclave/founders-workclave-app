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
  { value: "gtbank", label: "GTBank" },
  { value: "first-bank", label: "First Bank" },
  { value: "uba", label: "UBA" },
  { value: "zenith-bank", label: "Zenith Bank" },
  { value: "fidelity-bank", label: "Fidelity Bank" },
  { value: "union-bank", label: "Union Bank" },
  { value: "sterling-bank", label: "Sterling Bank" },
  { value: "stanbic-ibtc", label: "Stanbic IBTC" },
  { value: "fcmb", label: "FCMB" },
  { value: "ecobank", label: "Ecobank" },
  { value: "wema-bank", label: "Wema Bank" },
  { value: "polaris-bank", label: "Polaris Bank" },
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
