import PinPad from "@/components/PinPad";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-gradient-to-b from-rose-50 to-orange-50 px-6 py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-5xl">🐻</div>
        <h1 className="text-2xl font-bold text-stone-800">Nicole App</h1>
        <p className="text-sm text-stone-500">Enter your 6-digit PIN</p>
      </div>
      <PinPad next={next} />
    </main>
  );
}
