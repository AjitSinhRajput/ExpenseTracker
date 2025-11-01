export type TransactionType = "Credit" | "Debit" | "Refund";
export type Category =
  | "Shopping"
  | "Travel"
  | "Utility"
  | "Food"
  | "Health"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  location: string;
  type: TransactionType;
  category: Category;
}
