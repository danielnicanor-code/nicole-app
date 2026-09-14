import Link from "next/link";
import { findCategory } from "@/lib/categories";
import { formatSignedCurrency, formatDayLabel } from "@/lib/format";
import type { Transaction } from "@/db/schema";

export default function TransactionRow({ tx }: { tx: Transaction }) {
  const category = findCategory(tx.type, tx.category);
  const [year, month, day] = tx.date.split("-").map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day));

  return (
    <Link
      href={`/expenses/${tx.id}`}
      className="flex items-center gap-3 px-4 py-3 transition hover:bg-stone-50 active:bg-stone-100"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
        style={{ backgroundColor: `${category.color}22` }}
      >
        {category.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-stone-800">{category.label}</p>
        <p className="truncate text-xs text-stone-400">
          {formatDayLabel(dateObj)}
          {tx.note ? ` · ${tx.note}` : ""}
        </p>
      </div>
      <p className={`shrink-0 text-sm font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
        {formatSignedCurrency(tx.amount, tx.type)}
      </p>
    </Link>
  );
}
