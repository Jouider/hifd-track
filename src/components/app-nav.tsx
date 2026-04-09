"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Trophy, BookOpen, Settings, LogOut, Menu, X, List } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "الرئيسية", icon: Home },
  { href: "/leaderboard", label: "المتصدرون", icon: Trophy },
  { href: "/sourates", label: "السور", icon: List },
  { href: "/review", label: "المراجعة", icon: BookOpen },
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
    <>
      {/* Desktop top bar */}
      <header className="hidden md:block border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            حفظ تراك
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/settings" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {user.name?.charAt(0) || "م"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="md:hidden border-b border-border bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            حفظ تراك
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <>
            <div className="fixed inset-0 top-14 bg-black/20 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-14 left-0 right-0 bg-card border-b border-border z-50 p-2 shadow-lg">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-border my-1" />
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-5 h-5" />
                الإعدادات
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-muted transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                تسجيل الخروج
              </button>
            </div>
          </>
        )}
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
