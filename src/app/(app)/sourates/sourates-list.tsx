"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, RefreshCw, Circle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SurahStatus = "NOT_STARTED" | "IN_REVISION" | "LEARNED";

interface SurahWithProgress {
  number: number;
  name: string;
  nameAr: string;
  ayahCount: number;
  pages: number;
  progress: {
    status: SurahStatus;
    revisionCount: number;
  } | null;
}

interface Props {
  surates: SurahWithProgress[];
}

const statusConfig = {
  LEARNED: {
    label: "محفوظة",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  IN_REVISION: {
    label: "مراجعة",
    icon: RefreshCw,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  NOT_STARTED: {
    label: "لم تبدأ",
    icon: Circle,
    color: "text-muted-foreground",
    bg: "bg-card border-border",
    dot: "bg-muted-foreground/30",
  },
};

type Filter = "all" | "LEARNED" | "IN_REVISION" | "NOT_STARTED";

export function SuratesList({ surates }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const learned = surates.filter((s) => s.progress?.status === "LEARNED").length;
  const inRevision = surates.filter((s) => s.progress?.status === "IN_REVISION").length;
  const notStarted = surates.length - learned - inRevision;

  const filtered = surates.filter((s) => {
    const status = s.progress?.status ?? "NOT_STARTED";
    const matchesFilter = filter === "all" || status === filter;
    const matchesSearch =
      !search ||
      s.nameAr.includes(search) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search);
    return matchesFilter && matchesSearch;
  });

  const filters: { key: Filter; label: string; count: number; color: string }[] = [
    { key: "all", label: "الكل", count: surates.length, color: "bg-primary/10 text-primary border-primary/20" },
    { key: "LEARNED", label: "محفوظة", count: learned, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { key: "IN_REVISION", label: "مراجعة", count: inRevision, color: "bg-amber-50 text-amber-700 border-amber-200" },
    { key: "NOT_STARTED", label: "لم تبدأ", count: notStarted, color: "bg-muted text-muted-foreground border-border" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">السور</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {learned} من {surates.length} سورة محفوظة
          </p>
        </div>

        {/* Progress ring summary */}
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted/30" />
              <circle
                cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeDasharray={`${(learned / 114) * 100} 100`}
                className="text-emerald-500"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
              {Math.round((learned / 114) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="ابحث عن سورة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-muted/50 border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:bg-background transition-colors"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all",
              filter === f.key ? f.color : "bg-card border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
            <span className="bg-black/5 rounded-md px-1.5 py-0.5">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Surah grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map((surah) => {
          const status = surah.progress?.status ?? "NOT_STARTED";
          const cfg = statusConfig[status];
          const Icon = cfg.icon;

          return (
            <Link
              key={surah.number}
              href={`/sourates/${surah.number}`}
              className={cn(
                "flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:shadow-sm active:scale-[0.99]",
                cfg.bg
              )}
            >
              {/* Number badge */}
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-background/80 flex items-center justify-center border border-border/50 shadow-sm">
                <span className="text-xs font-bold text-foreground">{surah.number}</span>
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">{surah.nameAr}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{surah.ayahCount} آية · {surah.pages} صفحة</p>
              </div>

              {/* Status + revision count */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className={cn("flex items-center gap-1", cfg.color)}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">{cfg.label}</span>
                </div>
                {surah.progress && surah.progress.revisionCount > 0 && (
                  <span className="text-[10px] text-muted-foreground bg-background/60 rounded-md px-1.5 py-0.5 border border-border/50">
                    {surah.progress.revisionCount} مراجعة
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">لا توجد نتائج</p>
        </div>
      )}
    </div>
  );
}
