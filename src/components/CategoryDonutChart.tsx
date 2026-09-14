"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { findCategory } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategoryBreakdownItem } from "@/lib/transactions";

const RADIAN = Math.PI / 180;

function renderSliceLabel(props: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  icon: string;
}) {
  const { cx, cy, midAngle, outerRadius, percent, icon } = props;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fill="#57534e">
      {icon} {Math.round(percent * 100)}%
    </text>
  );
}

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
    return { name: category.label, icon: category.icon, value: d.total, color: category.color };
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={2}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label={renderSliceLabel as any}
          labelLine={{ stroke: "#d6d3d1" }}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
      </PieChart>
    </ResponsiveContainer>
  );
}
