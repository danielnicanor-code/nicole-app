export default function EmptyState({
  icon = "🐻",
  title,
  subtitle,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="text-sm font-semibold text-stone-600">{title}</p>
      {subtitle && <p className="max-w-xs text-sm text-stone-400">{subtitle}</p>}
    </div>
  );
}
