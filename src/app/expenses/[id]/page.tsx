import { notFound } from "next/navigation";
import TransactionForm from "@/components/TransactionForm";
import { getTransactionById } from "@/lib/transactions";

export const dynamic = "force-dynamic";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await getTransactionById(id);

  if (!transaction) {
    notFound();
  }

  return <TransactionForm mode="edit" transaction={transaction} />;
}
