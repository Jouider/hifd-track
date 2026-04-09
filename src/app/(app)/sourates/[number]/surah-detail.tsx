"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RefreshCw, BookOpen, ArrowRight, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { updateSurahStatus, addRevision } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { Surah } from "@/lib/quran-data";

type SurahStatus = "NOT_STARTED" | "IN_REVISION" | "LEARNED";

interface Progress {
  status: SurahStatus;
  revisionCount: number;
  learnedAt: Date | null;
  lastRevisionAt: Date | null;
}

interface Ayah {
  numberInSurah: number;
  text: string;
  page: number;
}

interface Props {
  surah: Surah;
  progress: Progress | null;
}

const statusConfig = {
  LEARNED: { label: "محفوظة", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  IN_REVISION: { label: "قيد المراجعة", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  NOT_STARTED: { label: "لم تبدأ", color: "text-muted-foreground", bg: "bg-muted border-border" },
};

// Convert number to Arabic-Indic numerals
function toArabicNumerals(n: number): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
}

// Inline verse-end marker ﴿٢﴾
function VerseMarker({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center mx-1 text-[13px] leading-none text-[#8B6914] font-['Amiri'] select-none">
      ﴿{toArabicNumerals(n)}﴾
    </span>
  );
}

export function SurahDetail({ surah, progress }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Mushaf state
  const [pages, setPages] = useState<Map<number, Ayah[]> | null>(null);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [showMushaf, setShowMushaf] = useState(false);

  const status = progress?.status ?? "NOT_STARTED";
  const cfg = statusConfig[status];

  async function handleMarkLearned() {
    setActiveAction("learned");
    startTransition(async () => {
      await updateSurahStatus(surah.number, "LEARNED");
      setActiveAction(null);
    });
  }

  async function handleAddRevision() {
    setActiveAction("revision");
    startTransition(async () => {
      await addRevision(surah.number);
      setActiveAction(null);
    });
  }

  const handleOpenMushaf = useCallback(async () => {
    if (showMushaf) {
      setShowMushaf(false);
      return;
    }

    if (pages) {
      setShowMushaf(true);
      return;
    }

    setLoadingAyahs(true);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.number}/quran-uthmani`
      );
      const data = await res.json();
      if (data.code === 200) {
        const ayahList: Ayah[] = data.data.ayahs.map((a: { numberInSurah: number; text: string; page: number }) => ({
          numberInSurah: a.numberInSurah,
          text: a.text,
          page: a.page,
        }));

        const pageMap = new Map<number, Ayah[]>();
        for (const ayah of ayahList) {
          if (!pageMap.has(ayah.page)) pageMap.set(ayah.page, []);
          pageMap.get(ayah.page)!.push(ayah);
        }

        const sortedPages = Array.from(pageMap.keys()).sort((a, b) => a - b);
        setPages(pageMap);
        setPageNumbers(sortedPages);
        setCurrentPageIdx(0);
        setShowMushaf(true);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingAyahs(false);
    }
  }, [showMushaf, pages, surah.number]);

  const currentPage = pageNumbers[currentPageIdx];
  const currentAyahs = pages?.get(currentPage) ?? [];
  const hasBismillah = surah.number !== 9 && surah.number !== 1;
  const isFirstPageOfSurah = currentPageIdx === 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-muted transition-colors flex-shrink-0"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{surah.nameAr}</h1>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">{surah.number}</span>
          </div>
          <p className="text-sm text-muted-foreground">{surah.ayahCount} آية · {surah.pages} صفحة</p>
        </div>
      </div>

      {/* Status card */}
      <div className={cn("flex items-center justify-between rounded-2xl border p-4", cfg.bg)}>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">الحالة</p>
          <p className={cn("font-semibold text-sm", cfg.color)}>{cfg.label}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-0.5">المراجعات</p>
          <p className="font-bold text-lg leading-tight">{progress?.revisionCount ?? 0}</p>
        </div>
        {progress?.lastRevisionAt && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-0.5">آخر مراجعة</p>
            <p className="text-xs font-medium">
              {new Date(progress.lastRevisionAt).toLocaleDateString("ar-SA")}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 gap-3">
        {/* Display Surah */}
        <button
          onClick={handleOpenMushaf}
          disabled={loadingAyahs}
          className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 active:scale-[0.99] transition-all text-right"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            {loadingAyahs ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <BookOpen className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{showMushaf ? "إغلاق المصحف" : "فتح المصحف"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">عرض الآيات صفحة بصفحة</p>
          </div>
        </button>

        {/* Mark as Learned */}
        <button
          onClick={handleMarkLearned}
          disabled={isPending || status === "LEARNED"}
          className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border active:scale-[0.99] transition-all text-right",
            status === "LEARNED"
              ? "border-emerald-200 bg-emerald-50 opacity-70 cursor-default"
              : "border-border bg-card hover:bg-emerald-50 hover:border-emerald-200"
          )}
        >
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
            status === "LEARNED" ? "bg-emerald-500" : "bg-emerald-50"
          )}>
            {activeAction === "learned" ? (
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            ) : (
              <CheckCircle2 className={cn("w-5 h-5", status === "LEARNED" ? "text-white" : "text-emerald-600")} />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">
              {status === "LEARNED" ? "تم الحفظ ✓" : "تحديد كمحفوظة"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {status === "LEARNED" && progress?.learnedAt
                ? `حُفظت في ${new Date(progress.learnedAt).toLocaleDateString("ar-SA")}`
                : "تسجيل هذه السورة كمحفوظة"}
            </p>
          </div>
        </button>

        {/* Add Revision */}
        <button
          onClick={handleAddRevision}
          disabled={isPending}
          className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-amber-50 hover:border-amber-200 active:scale-[0.99] transition-all text-right"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            {activeAction === "revision" ? (
              <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">تسجيل مراجعة</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {progress?.revisionCount
                ? `راجعت ${progress.revisionCount} مرة حتى الآن`
                : "سجّل مراجعة لهذه السورة"}
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-100 rounded-lg px-2 py-1 flex-shrink-0">
            +1
          </span>
        </button>
      </div>

      {/* Mushaf view */}
      {showMushaf && pages && (
        <div
          className="rounded-2xl overflow-hidden border border-[#c8a96e]/40 shadow-lg"
          style={{ background: "linear-gradient(180deg, #fdf6e3 0%, #fef9ec 100%)" }}
        >
          {/* Page header */}
          <div
            className="flex items-center justify-between px-5 py-3 border-b border-[#c8a96e]/30"
            style={{ background: "rgba(200,169,110,0.08)" }}
          >
            <button
              onClick={() => setShowMushaf(false)}
              className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4 text-[#8B6914]" />
            </button>
            <div className="text-center">
              <p className="text-xs font-semibold text-[#8B6914]">{surah.nameAr}</p>
              <p className="text-[11px] text-[#8B6914]/70">
                صفحة {toArabicNumerals(currentPage)} ·{" "}
                {toArabicNumerals(currentPageIdx + 1)} / {toArabicNumerals(pageNumbers.length)}
              </p>
            </div>
            {/* empty spacer to balance flex */}
            <div className="w-7" />
          </div>

          {/* Page content */}
          <div className="px-6 py-6 min-h-[320px] flex flex-col">
            {/* Bismillah — only on first page of surah, not for surah 1 or 9 */}
            {isFirstPageOfSurah && hasBismillah && (
              <p className="text-center text-lg font-semibold mb-5 text-[#8B6914]" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            )}

            {/* Verses — flowing text like a real page */}
            <p
              className="text-base leading-[2.2] text-foreground text-justify flex-1"
              dir="rtl"
            >
              {currentAyahs.map((ayah) => (
                <span key={ayah.numberInSurah}>
                  {ayah.text}
                  <VerseMarker n={ayah.numberInSurah} />
                </span>
              ))}
            </p>
          </div>

          {/* Page navigation */}
          <div
            className="flex items-center justify-between px-5 py-3 border-t border-[#c8a96e]/30"
            style={{ background: "rgba(200,169,110,0.08)" }}
          >
            {/* Previous page (rtl: this is "next" in reading order) */}
            <button
              onClick={() => setCurrentPageIdx((i) => Math.min(i + 1, pageNumbers.length - 1))}
              disabled={currentPageIdx >= pageNumbers.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#8B6914] hover:bg-black/5 disabled:opacity-30 disabled:cursor-default transition-all"
            >
              <ChevronRight className="w-4 h-4" />
              التالية
            </button>

            {/* Dots */}
            <div className="flex gap-1">
              {pageNumbers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPageIdx(i)}
                  className={cn(
                    "rounded-full transition-all",
                    i === currentPageIdx
                      ? "w-5 h-2 bg-[#8B6914]"
                      : "w-2 h-2 bg-[#c8a96e]/40 hover:bg-[#c8a96e]/70"
                  )}
                />
              ))}
            </div>

            {/* Next page (rtl: "previous" in reading order) */}
            <button
              onClick={() => setCurrentPageIdx((i) => Math.max(i - 1, 0))}
              disabled={currentPageIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#8B6914] hover:bg-black/5 disabled:opacity-30 disabled:cursor-default transition-all"
            >
              السابقة
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
