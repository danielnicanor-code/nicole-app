"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction, updateTransaction, deleteTransaction } from "@/app/actions";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type TransactionType } from "@/lib/categories";
import { todayISODate } from "@/lib/format";
import type { Transaction } from "@/db/schema";

interface TransactionFormProps {
  mode: "add" | "edit";
  transaction?: Transaction;
}

export default function TransactionForm({ mode, transaction }: TransactionFormProps) {
  const router = useRouter();
  const action = mode === "edit" ? updateTransaction : createTransaction;
  const [state, formAction, isPending] = useActionState(action, undefined);

  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const [category, setCategory] = useState<string>(transaction?.category ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleTypeChange(next: TransactionType) {
    if (next === type) return;
    setType(next);
    setCategory("");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-[#bf648f]">
      <header className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-stone-500 hover:bg-stone-100"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-stone-800">
          {mode === "edit" ? "Edit Transaction" : "Add Transaction"}
        </h1>
      </header>

      <form action={formAction} className="flex flex-1 flex-col gap-6 px-4 py-6">
        {mode === "edit" && transaction && <input type="hidden" name="id" value={transaction.id} />}
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="category" value={category} />

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-stone-200/60 p-1">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              type === "expense" ? "bg-white text-red-500 shadow-sm" : "text-stone-500"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              type === "income" ? "bg-white text-green-600 shadow-sm" : "text-stone-500"
            }`}
          >
            Income
          </button>
        </div>

        <div>
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-stone-600">
            Amount
          </label>
          <div className="flex items-center rounded-2xl border border-stone-200 bg-white px-4 py-3 focus-within:border-rose-300">
            <span className="mr-2 text-lg text-stone-400">₱</span>
            <input
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              defaultValue={transaction?.amount ?? ""}
              placeholder="0.00"
              required
              className="w-full bg-transparent text-2xl font-semibold text-stone-800 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">
            {type === "expense" ? "Category" : "Source"}
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {categories.map((c) => (
              <button
                type="button"
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition ${
                  category === c.key ? "border-rose-300 bg-rose-50" : "border-stone-200 bg-white"
                }`}
              >
                <span className="text-xl">{c.icon}</span>
                <span className="text-[11px] font-medium leading-tight text-stone-600">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-stone-600">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={transaction?.date ?? todayISODate()}
            required
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-rose-300"
          />
        </div>

        <div>
          <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-stone-600">
            Note (optional)
          </label>
          <input
            id="note"
            name="note"
            type="text"
            defaultValue={transaction?.note ?? ""}
            placeholder="Add a note..."
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none focus:border-rose-300"
          />
        </div>

        {state?.error && <p className="text-sm font-medium text-red-500">{state.error}</p>}

        <div className="mt-auto pt-4">
          <button
            type="submit"
            disabled={isPending || !category}
            className="w-full rounded-2xl bg-rose-500 py-3.5 text-center text-base font-semibold text-white shadow-sm transition active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>

      {mode === "edit" && transaction && (
        <div className="px-4 pb-6">
          {!confirmingDelete ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="w-full rounded-2xl border border-red-200 py-3.5 text-center text-sm font-semibold text-red-500"
            >
              Delete transaction
            </button>
          ) : (
            <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">Delete this transaction? This can&apos;t be undone.</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="flex-1 rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-semibold text-stone-600"
                >
                  Cancel
                </button>
                <form action={deleteTransaction.bind(null, transaction.id)} className="flex-1">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white"
                  >
                    Confirm delete
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
