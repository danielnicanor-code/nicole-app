import { Suspense } from "react";
import Link from "next/link";
import TransactionRow from "@/components/TransactionRow";
import CategoryDonutChart from "@/components/CategoryDonutChart";
import EmptyState from "@/components/EmptyState";
import AddCelebrationToast from "@/components/AddCelebrationToast";
import { formatCurrency, formatMonthLabel, getCurrentManilaDateParts, getManilaGreeting } from "@/lib/format";
import { getRecentTransactions, getTransactionsForMonth, summarizeMonth, breakdownByCategory } from "@/lib/transactions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { year, month } = getCurrentManilaDateParts();
  const monthDate = new Date(Date.UTC(year, month - 1, 1));
  const greeting = getManilaGreeting();

  const [monthTransactions, recent] = await Promise.all([
    getTransactionsForMonth(year, month),
    getRecentTransactions(8),
  ]);

  const { income, expense } = summarizeMonth(monthTransactions);
  const net = income - expense;
  const expenseBreakdown = breakdownByCategory(monthTransactions, "expense");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
      <Suspense fallback={null}>
        <AddCelebrationToast />
      </Suspense>

      <header>
        <h1 className="text-2xl font-bold text-stone-800">{greeting}, Colai! 👋</h1>
        <p className="text-sm text-stone-500">{formatMonthLabel(monthDate)}</p>
      </header>

      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-2xl bg-white p-2.5 shadow-sm sm:p-3.5">
          <p className="text-xs font-medium text-stone-400">Income</p>
          <p className="mt-1 break-words text-sm font-bold leading-tight text-green-600 sm:text-lg">{formatCurrency(income)}</p>
        </div>
        <div className="rounded-2xl bg-white p-2.5 shadow-sm sm:p-3.5">
          <p className="text-xs font-medium text-stone-400">Expenses</p>
          <p className="mt-1 break-words text-sm font-bold leading-tight text-red-500 sm:text-lg">{formatCurrency(expense)}</p>
        </div>
        <div className="rounded-2xl bg-white p-2.5 shadow-sm sm:p-3.5">
          <p className="text-xs font-medium text-stone-400">Net</p>
          <p className={`mt-1 break-words text-sm font-bold leading-tight sm:text-lg ${net >= 0 ? "text-green-600" : "text-orange-500"}`}>
            {formatCurrency(net)}
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-stone-700">This month&apos;s expenses</h2>
        <CategoryDonutChart data={expenseBreakdown} />
      </section>

      <section className="rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-sm font-semibold text-stone-700">Recent activity</h2>
          <Link href="/expenses" className="text-xs font-medium text-rose-500">
            See all
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState title="No transactions yet" subtitle="Tap the + button to add your first expense or income." />
        ) : (
          <div className="mt-2 divide-y divide-stone-100">
            {recent.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
