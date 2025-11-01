import dayjs from "dayjs";
import { Transaction } from "../types";

export function validateTransaction(input: Omit<Transaction, "id">) {
  const errors: Record<string, string> = {};

  if (!input.date || !dayjs(input.date, "YYYY-MM-DD", true).isValid()) {
    errors.date = "Date must be YYYY-MM-DD";
  }
  if (isNaN(input.amount) || input.amount <= 0) {
    errors.amount = "Amount must be a positive number";
  }
  if (!input.description?.trim()) {
    errors.description = "Description is required";
  }
  if (!input.location?.trim()) {
    errors.location = "Location is required";
  }
  if (!["Credit", "Debit", "Refund"].includes(input.type)) {
    errors.type = "Type must be Credit, Debit, or Refund";
  }
  const categories = [
    "Shopping",
    "Travel",
    "Utility",
    "Food",
    "Health",
    "Other",
  ];
  if (!categories.includes(input.category)) {
    errors.category = "Invalid category";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
