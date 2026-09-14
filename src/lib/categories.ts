export type TransactionType = "expense" | "income";

export interface Category {
  key: string;
  label: string;
  icon: string;
  color: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { key: "Food & Dining", label: "Food & Dining", icon: "🍔", color: "#F97316" },
  { key: "Groceries", label: "Groceries", icon: "🛒", color: "#84CC16" },
  { key: "Transportation", label: "Transportation", icon: "🚗", color: "#0EA5E9" },
  { key: "Housing/Rent", label: "Housing/Rent", icon: "🏠", color: "#8B5CF6" },
  { key: "Utilities & Bills", label: "Utilities & Bills", icon: "💡", color: "#EAB308" },
  { key: "Shopping", label: "Shopping", icon: "🛍️", color: "#EC4899" },
  { key: "Online Purchase", label: "Online Purchase", icon: "📦", color: "#0891B2" },
  { key: "Health & Medical", label: "Health & Medical", icon: "🩺", color: "#EF4444" },
  { key: "Personal Care", label: "Personal Care", icon: "🧴", color: "#F472B6" },
  { key: "Entertainment", label: "Entertainment", icon: "🎬", color: "#A855F7" },
  { key: "Subscriptions", label: "Subscriptions", icon: "📱", color: "#6366F1" },
  { key: "Education", label: "Education", icon: "📚", color: "#14B8A6" },
  { key: "Gifts & Donations", label: "Gifts & Donations", icon: "🎁", color: "#F43F5E" },
  { key: "Savings/Investments", label: "Savings/Investments", icon: "💰", color: "#22C55E" },
  // key stays "Other" so any existing transactions already saved under it still match.
  { key: "Other", label: "Others (butbot)", icon: "🧾", color: "#94A3B8" },
];

export const INCOME_CATEGORIES: Category[] = [
  { key: "Allowance – Mama", label: "Allowance – Mama", icon: "💝", color: "#22C55E" },
  { key: "Allowance – Daddy", label: "Allowance – Daddy", icon: "💝", color: "#16A34A" },
  { key: "SP Practice", label: "SP Practice", icon: "🩺", color: "#10B981" },
  { key: "Med Practice", label: "Med Practice", icon: "⚕️", color: "#059669" },
  { key: "Other Income", label: "Other Income", icon: "💵", color: "#65A30D" },
];

export function getCategoriesForType(type: TransactionType): Category[] {
  return type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
}

export function findCategory(type: TransactionType, key: string): Category {
  const list = getCategoriesForType(type);
  return (
    list.find((c) => c.key === key) ?? {
      key,
      label: key,
      icon: type === "expense" ? "🧾" : "💵",
      color: "#94A3B8",
    }
  );
}
