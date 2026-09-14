import { db } from "@/db";
import { transactions, type Transaction } from "@/db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { getCurrentManilaDateParts } from "./format";

export type { Transaction };

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Parses a stored 'YYYY-MM-DD' date string without any timezone conversion. */
export function parseISODateParts(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
}

export function monthRangeDates(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${pad2(month)}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const end = `${year}-${pad2(month)}-${pad2(lastDay)}`;
  return { start, end };
}

export async function listTransactions(filter?: { type?: "expense" | "income" }): Promise<Transaction[]> {
  const conditions = [];
  if (filter?.type) conditions.push(eq(transactions.type, filter.type));
  return db
    .select()
    .from(transactions)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(transactions.date), desc(transactions.createdAt));
}

export async function getRecentTransactions(limit = 8): Promise<Transaction[]> {
  return db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.date), desc(transactions.createdAt))
    .limit(limit);
}

export async function getTransactionById(id: string): Promise<Transaction | undefined> {
  const [row] = await db.select().from(transactions).where(eq(transactions.id, id));
  return row;
}

export async function getTransactionsForMonth(year: number, month: number): Promise<Transaction[]> {
  const { start, end } = monthRangeDates(year, month);
  return db
    .select()
    .from(transactions)
    .where(and(gte(transactions.date, start), lte(transactions.date, end)))
    .orderBy(desc(transactions.date), desc(transactions.createdAt));
}

export interface MonthTotals {
  year: number;
  month: number;
  income: number;
  expense: number;
}

export function summarizeMonth(rows: Transaction[]): { income: number; expense: number } {
  let income = 0;
  let expense = 0;
  for (const row of rows) {
    const amount = Number(row.amount);
    if (row.type === "income") income += amount;
    else expense += amount;
  }
  return { income, expense };
}

export async function getMonthlyTotals(monthsBack: number): Promise<MonthTotals[]> {
  const { year: nowYear, month: nowMonth } = getCurrentManilaDateParts();
  const months: { year: number; month: number }[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(nowYear, nowMonth - 1 - i, 1));
    months.push({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 });
  }

  const rangeStart = `${months[0].year}-${pad2(months[0].month)}-01`;
  const rows = await db.select().from(transactions).where(gte(transactions.date, rangeStart));

  const totals = new Map<string, MonthTotals>();
  for (const m of months) {
    totals.set(`${m.year}-${m.month}`, { year: m.year, month: m.month, income: 0, expense: 0 });
  }

  for (const row of rows) {
    const { year, month } = parseISODateParts(row.date);
    const entry = totals.get(`${year}-${month}`);
    if (!entry) continue;
    const amount = Number(row.amount);
    if (row.type === "income") entry.income += amount;
    else entry.expense += amount;
  }

  return months.map((m) => totals.get(`${m.year}-${m.month}`)!);
}

export interface CategoryBreakdownItem {
  category: string;
  total: number;
  percent: number;
}

export function breakdownByCategory(rows: Transaction[], type: "expense" | "income"): CategoryBreakdownItem[] {
  const filtered = rows.filter((r) => r.type === type);
  const totals = new Map<string, number>();
  let grandTotal = 0;
  for (const r of filtered) {
    const amount = Number(r.amount);
    totals.set(r.category, (totals.get(r.category) ?? 0) + amount);
    grandTotal += amount;
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category,
      total,
      percent: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}
