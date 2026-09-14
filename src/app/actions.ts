"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface TransactionFormState {
  error?: string;
}

function parseFormData(formData: FormData) {
  const type = String(formData.get("type"));
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();

  if (type !== "expense" && type !== "income") {
    return { error: "Invalid transaction type." } as const;
  }
  const amount = Number(amountRaw);
  if (!amountRaw || !Number.isFinite(amount) || amount <= 0) {
    return { error: "Enter a valid amount greater than 0." } as const;
  }
  if (!category) {
    return { error: "Choose a category." } as const;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Choose a valid date." } as const;
  }

  return {
    data: {
      type,
      amount: amount.toFixed(2),
      category,
      note: note || null,
      date,
    },
  } as const;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/expenses");
  revalidatePath("/summary");
}

export async function createTransaction(
  _prevState: TransactionFormState | undefined,
  formData: FormData
): Promise<TransactionFormState> {
  const parsed = parseFormData(formData);
  if ("error" in parsed) return { error: parsed.error };

  await db.insert(transactions).values(parsed.data);

  revalidateAll();
  redirect("/?celebrate=1");
}

export async function updateTransaction(
  _prevState: TransactionFormState | undefined,
  formData: FormData
): Promise<TransactionFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing transaction id." };

  const parsed = parseFormData(formData);
  if ("error" in parsed) return { error: parsed.error };

  await db
    .update(transactions)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(transactions.id, id));

  revalidateAll();
  redirect("/expenses");
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.delete(transactions).where(eq(transactions.id, id));
  revalidateAll();
  redirect("/expenses");
}
