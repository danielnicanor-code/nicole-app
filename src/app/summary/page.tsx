import Link from "next/link";
import CategoryBreakdownList from "@/components/CategoryBreakdownList";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import { formatCurrency, formatMonthLabel, formatMonthShort, getCurrentManilaDateParts } from "@/lib/format";
import { breakdownByCategory, getMonthlyTotals, getTransactionsForMonth, summarizeMonth } from "@/lib/transactions";

export const dynamic = "force-dynamic";

const MONTHS_IN_SELECTOR = 12;

function parseMonthParam(param: string | undefined): { year: number; month: number } {
  if (param && /^\d{4}-\d{2}$/.test(param)) {
    const [y, m] = param.split("-").map(Number);
    if (m >= 1 && m <= 12) return { year: y, month: m };
  }
  return getCurrentManilaDateParts();
}

function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function DeltaBadge({ value }: { value: number | null }) {
  if (value === null) return null;
  const isFlat = Math.abs(value) < 0.5;
  const isUp = value > 0;
  return (
    <span
      className={`text-[11px] font-semibold ${isFlat ? "text-stone-500" : isUp ? "text-positive" : "text-negative"}`}
    >
      {isFlat ? "No change" : `${isUp ? "▲" : "▼"} ${Math.abs(value).toFixed(0)}% vs last month`}
    </span>
  );
}

export default async function SummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const { year, month } = parseMonthParam(monthParam);
  const { year: prevYear, month: prevMonth } = shiftMonth(year, month, -1);
  const { year: currentYear, month: currentMonth } = getCurrentManilaDateParts();

  const [monthlyTotals, selectedTransactions, previousTransactions] = await Promise.all([
    getMonthlyTotals(MONTHS_IN_SELECTOR),
    getTransactionsForMonth(year, month),
    getTransactionsForMonth(prevYear, prevMonth),
  ]);

  const selected = summarizeMonth(selectedTransactions);
  const previous = summarizeMonth(previousTransactions);
  const net = selected.income - selected.expense;
  const prevNet = previous.income - previous.expense;

  const expenseBreakdown = breakdownByCategory(selectedTransactions, "expense");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-stone-900">Summary</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {monthlyTotals.map((m) => {
          const active = m.year === year && m.month === month;
          return (
            <Link
              key={`${m.year}-${m.month}`}
              href={`/summary?month=${m.year}-${String(m.month).padStart(2, "0")}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                active ? "bg-accent text-white" : "bg-white text-stone-500 shadow-sm"
              }`}
            >
              {formatMonthShort(new Date(Date.UTC(m.year, m.month - 1, 1)))}
              {m.year === currentYear && m.month === currentMonth ? " •" : ""}
            </Link>
          );
        })}
      </div>

      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-2xl bg-white p-2.5 shadow-sm sm:p-3.5">
          <p className="text-xs font-medium text-stone-500">Income</p>
          <p className="mt-1 break-words text-sm font-bold leading-tight text-positive sm:text-lg">
            {formatCurrency(selected.income)}
          </p>
          <DeltaBadge value={percentChange(selected.income, previous.income)} />
        </div>
        <div className="rounded-2xl bg-white p-2.5 shadow-sm sm:p-3.5">
          <p className="text-xs font-medium text-stone-500">Expenses</p>
          <p className="mt-1 break-words text-sm font-bold leading-tight text-negative sm:text-lg">
            {formatCurrency(selected.expense)}
          </p>
          <DeltaBadge value={percentChange(selected.expense, previous.expense)} />
        </div>
        <div className="rounded-2xl bg-white p-2.5 shadow-sm sm:p-3.5">
          <p className="text-xs font-medium text-stone-500">Net</p>
          <p className={`mt-1 break-words text-sm font-bold leading-tight sm:text-lg ${net >= 0 ? "text-positive" : "text-warning"}`}>
            {formatCurrency(net)}
          </p>
          <DeltaBadge value={percentChange(net, prevNet)} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-stone-700">Income vs Expenses</h2>
        <MonthlyBarChart data={monthlyTotals} />
      </section>

      <section className="rounded-2xl bg-white shadow-sm">
        <h2 className="px-4 pt-4 text-sm font-semibold text-stone-700">
          Expense breakdown — {formatMonthLabel(new Date(Date.UTC(year, month - 1, 1)))}
        </h2>
        <CategoryBreakdownList data={expenseBreakdown} />
      </section>
    </div>
  );
}
