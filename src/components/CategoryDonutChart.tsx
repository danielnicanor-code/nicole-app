"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { findCategory } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategoryBreakdownItem } from "@/lib/transactions";

export default function CategoryDonutChart({ data }: { data: CategoryBreakdownItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-stone-400">
        No expenses yet this month
      </div>
    );
  }

  const chartData = data.map((d) => {
    const category = findCategory("expense", d.category);
    return { name: category.label, value: d.total, color: category.color };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
      </PieChart>
    </ResponsiveContainer>
  );
}
