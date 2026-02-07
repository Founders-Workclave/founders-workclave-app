export interface PaymentHistory {
  id: string;
  order: number;
  amount: string;
  milestoneName: string;
  paymentDate: string;
  paymentChannel: string;
  status: string;
}

export interface ProjectPaymentsResponse {
  message: string;
  projectValue: string;
  paid: string;
  remaining: string;
  paymenthistory: PaymentHistory[];
}
