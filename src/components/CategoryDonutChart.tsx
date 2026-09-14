"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { findCategory } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategoryBreakdownItem } from "@/lib/transactions";

export default function CategoryDonutChart({ data }: { data: CategoryBreakdownItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-stone-500">
        No expenses yet this month
      </div>
    );
  }

  const chartData = data.map((d) => {
    const category = findCategory("expense", d.category);
    return { name: category.label, icon: category.icon, value: d.total, color: category.color, percent: d.percent };
  });

  return (
    <div className="flex items-center gap-4">
      <div className="h-36 w-36 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={66} paddingAngle={2}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} aria-hidden />
            <span aria-hidden>{entry.icon}</span>
            <span className="min-w-0 flex-1 truncate text-stone-600">{entry.name}</span>
            <span className="shrink-0 font-semibold text-stone-800">{Math.round(entry.percent)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
