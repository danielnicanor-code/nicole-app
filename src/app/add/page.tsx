import TransactionForm from "@/components/TransactionForm";

export default async function AddPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const initialType = type === "income" ? "income" : "expense";

  return <TransactionForm mode="add" initialType={initialType} />;
}
