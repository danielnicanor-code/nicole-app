import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { transactions } from "./schema";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../lib/categories";

function randomAmount(min: number, max: number): string {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function isoDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

async function seed() {
  console.log("Seeding sample transactions…");

  const sample = [
    ...Array.from({ length: 20 }).map((_, i) => ({
      type: "expense" as const,
      amount: randomAmount(50, 1500),
      category: EXPENSE_CATEGORIES[i % EXPENSE_CATEGORIES.length].key,
      note: null,
      date: isoDateDaysAgo(i * 3),
    })),
    ...Array.from({ length: 6 }).map((_, i) => ({
      type: "income" as const,
      amount: randomAmount(2000, 15000),
      category: INCOME_CATEGORIES[i % INCOME_CATEGORIES.length].key,
      note: null,
      date: isoDateDaysAgo(i * 10),
    })),
  ];

  await db.insert(transactions).values(sample);
  console.log(`Inserted ${sample.length} sample transactions.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
