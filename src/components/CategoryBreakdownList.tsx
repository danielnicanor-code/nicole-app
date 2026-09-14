import { findCategory } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategoryBreakdownItem } from "@/lib/transactions";

export default function CategoryBreakdownList({ data }: { data: CategoryBreakdownItem[] }) {
  if (data.length === 0) {
    return <p className="px-4 py-6 text-center text-sm text-stone-400">No expenses for this month yet.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-stone-100">
      {data.map((item) => {
        const category = findCategory("expense", item.category);
        return (
          <div key={item.category} className="flex items-center gap-3 px-4 py-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
              style={{ backgroundColor: `${category.color}22` }}
            >
              {category.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-stone-700">{category.label}</p>
                <p className="shrink-0 text-sm font-semibold text-stone-800">{formatCurrency(item.total)}</p>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.percent}%`, backgroundColor: category.color }}
                />
              </div>
            </div>
            <p className="w-10 shrink-0 text-right text-xs text-stone-400">{item.percent.toFixed(0)}%</p>
          </div>
        );
      })}
    </div>
  );
}
