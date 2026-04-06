import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <AppNav user={session.user} />
      <main className="flex-1 px-4 py-6 pb-24 md:pb-6 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
