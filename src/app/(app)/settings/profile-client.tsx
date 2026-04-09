"use client";

import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, CheckCircle2, RefreshCw, Circle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SurahStatus = "NOT_STARTED" | "IN_REVISION" | "LEARNED";

interface SurahStat {
  number: number;
  nameAr: string;
  status: SurahStatus;
  revisionCount: number;
}

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null } | null;
  surateStats: SurahStat[];
  learned: number;
  inRevision: number;
}

const cellColor: Record<SurahStatus, string> = {
  LEARNED: "bg-emerald-500",
  IN_REVISION: "bg-amber-400",
  NOT_STARTED: "bg-muted",
};

// Group surahs into juz-like rows of ~10
function chunkSurahs(arr: SurahStat[], size: number) {
  const chunks: SurahStat[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function ProfileClient({ user, surateStats, learned, inRevision }: Props) {
  const total = surateStats.length;
  const notStarted = total - learned - inRevision;
  const rows = chunkSurahs(surateStats, 10); // 10 per row → ~12 rows for 114 surahs

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 border-2 border-primary/10">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback className="text-xl bg-primary/10 text-primary">
            {user?.name?.charAt(0) || "م"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-bold">{user?.name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">{learned}</p>
          <p className="text-xs text-emerald-700 mt-0.5">محفوظة</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{inRevision}</p>
          <p className="text-xs text-amber-700 mt-0.5">مراجعة</p>
        </div>
        <div className="bg-muted border border-border rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{notStarted}</p>
          <p className="text-xs text-muted-foreground mt-0.5">لم تبدأ</p>
        </div>
      </div>

      {/* Progress percentage */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>تقدم الحفظ</span>
          <span>{Math.round((learned / total) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${(learned / total) * 100}%` }}
          />
        </div>
      </div>

      {/* GitHub-like surah grid */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">خريطة السور</h2>
        <div className="bg-card border border-border rounded-2xl p-4 overflow-x-auto">
          <div className="space-y-1.5 min-w-[500px]">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1.5">
                {row.map((s) => (
                  <Link
                    key={s.number}
                    href={`/sourates/${s.number}`}
                    className={cn(
                      "flex-1 h-10 rounded-md transition-all hover:opacity-80 hover:ring-2 hover:ring-primary/30 cursor-pointer flex items-center justify-center overflow-hidden px-0.5",
                      cellColor[s.status]
                    )}
                  >
                    <span className={cn(
                      "text-[9px] font-medium leading-tight text-center truncate w-full text-center",
                      s.status === "NOT_STARTED" ? "text-muted-foreground" : "text-white"
                    )}>
                      {s.nameAr}
                    </span>
                  </Link>
                ))}
                {/* Fill remaining if last row has < 10 */}
                {row.length < 10 &&
                  Array.from({ length: 10 - row.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex-1 h-10" />
                  ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
            {[
              { color: "bg-emerald-500", label: "محفوظة" },
              { color: "bg-amber-400", label: "مراجعة" },
              { color: "bg-muted", label: "لم تبدأ" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded-sm", item.color)} />
                <span className="text-[11px] text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend icons */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold">الإحصائيات</h2>
        {[
          { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "السور المحفوظة", value: `${learned} / ${total}` },
          { icon: RefreshCw, color: "text-amber-600", bg: "bg-amber-50", label: "قيد المراجعة", value: String(inRevision) },
          { icon: Circle, color: "text-muted-foreground", bg: "bg-muted", label: "لم تبدأ بعد", value: String(notStarted) },
        ].map(({ icon: Icon, color, bg, label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", bg)}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <span className="text-sm">{label}</span>
            </div>
            <span className="font-bold text-sm">{value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full h-11 rounded-xl border border-border flex items-center justify-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        تسجيل الخروج
      </button>
    </div>
  );
}
