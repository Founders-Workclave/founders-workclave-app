export interface MilestoneDataPopup {
  id: number;
  number: number;
  title: string;
  description: string;
  dueDate: string;
  completedDate: string | null;
  payment: number;
  status: string;
  progress: number;
  deliverables: string[];
  note?: string;
}

export interface PaymentOption {
  id: "wallet" | "paystack";
  label: string;
  balance?: number;
  icon: string;
}

export type PaymentStep = "milestone-details" | "payment-options";
