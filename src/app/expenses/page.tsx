import ExpensesList from "@/components/ExpensesList";
import { listTransactions } from "@/lib/transactions";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const transactions = await listTransactions();
  return <ExpensesList transactions={transactions} />;
}
