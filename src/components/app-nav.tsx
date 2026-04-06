"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "الرئيسية" },
  { href: "/leaderboard", label: "المتصدرون" },
  { href: "/challenge", label: "التحدي" },
  { href: "/review", label: "المراجعة" },
];

interface AppNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AppNav({ user }: AppNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto max-w-5xl flex items-center justify-between px-4 h-14">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          حفظ تراك
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                size="sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary transition-colors"
          >
            <Avatar className="w-7 h-7">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-xs">
                {user.name?.charAt(0) || "م"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm">{user.name}</span>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute left-0 top-full mt-1 z-50 w-48 rounded-lg border border-border bg-card shadow-lg p-1">
                <div className="md:hidden">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-right px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-border my-1" />
                </div>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-right px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
                >
                  الإعدادات
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-right px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-destructive"
                >
                  تسجيل الخروج
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
