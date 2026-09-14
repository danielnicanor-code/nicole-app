"use client";

import { useMemo, useState } from "react";
import TransactionRow from "./TransactionRow";
import EmptyState from "./EmptyState";
import { formatMonthLabel } from "@/lib/format";
import type { Transaction } from "@/db/schema";

type Filter = "all" | "expense" | "income";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "expense", label: "Expenses" },
  { key: "income", label: "Income" },
];

export default function ExpensesList({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? transactions : transactions.filter((t) => t.type === filter)),
    [transactions, filter]
  );

  const groups = useMemo(() => {
    const map = new Map<string, { label: string; items: Transaction[] }>();
    for (const tx of filtered) {
      const [y, m] = tx.date.split("-").map(Number);
      const key = `${y}-${m}`;
      if (!map.has(key)) {
        map.set(key, { label: formatMonthLabel(new Date(Date.UTC(y, m - 1, 1))), items: [] });
      }
      map.get(key)!.items.push(tx);
    }
    return Array.from(map.values());
  }, [filtered]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
      <h1 className="text-2xl font-bold text-stone-800">Expenses</h1>

      <div className="flex gap-2 rounded-2xl bg-stone-200/60 p-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
              filter === f.key ? "bg-white text-stone-800 shadow-sm" : "text-stone-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl bg-white shadow-sm">
          <EmptyState title="No transactions yet" subtitle="Tap the + button to log your first expense or income." />
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.label} className="rounded-2xl bg-white shadow-sm">
            <h2 className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-stone-400">
              {group.label}
            </h2>
            <div className="mt-1 divide-y divide-stone-100">
              {group.items.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
