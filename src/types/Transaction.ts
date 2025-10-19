export interface User {
  id: number;
  name: string;
}

export type TransactionType = "RESERVATION" | "REFUND";

export interface Transaction {
  id: number;
  fromUser?: User | null;
  toUser?: User | null;
  amount: number;
  type: TransactionType;
  description?: string | null;
  createdAt: string;
}
