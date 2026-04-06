"use client";

import { useState } from "react";
import { logMemorization } from "@/lib/actions";
import { surahs } from "@/lib/quran-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";

interface LogFormProps {
  todayLog: {
    surahNumber: number;
    ayahStart: number;
    ayahEnd: number;
    pagesLogged: number;
    notes: string | null;
  } | null;
}

export function LogForm({ todayLog }: LogFormProps) {
  const [surahNumber, setSurahNumber] = useState(todayLog?.surahNumber?.toString() || "");
  const [ayahStart, setAyahStart] = useState(todayLog?.ayahStart?.toString() || "1");
  const [ayahEnd, setAyahEnd] = useState(todayLog?.ayahEnd?.toString() || "");
  const [pagesLogged, setPagesLogged] = useState(todayLog?.pagesLogged?.toString() || "0.5");
  const [notes, setNotes] = useState(todayLog?.notes || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedSurah = surahs.find((s) => s.number.toString() === surahNumber);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.set("surahNumber", surahNumber);
    formData.set("surahName", selectedSurah?.nameAr || "");
    formData.set("ayahStart", ayahStart);
    formData.set("ayahEnd", ayahEnd);
    formData.set("pagesLogged", pagesLogged);
    formData.set("notes", notes);

    try {
      await logMemorization(formData);
      setSuccess(true);
    } catch {
      // error handled
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">السورة</Label>
        <select
          value={surahNumber}
          onChange={(e) => {
            setSurahNumber(e.target.value);
            setAyahEnd("");
          }}
          className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          <option value="">اختر السورة</option>
          {surahs.map((s) => (
            <option key={s.number} value={s.number}>
              {s.number}. {s.nameAr}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">عدد الصفحات</Label>
        <Input
          type="number"
          step="0.5"
          min="0.5"
          value={pagesLogged}
          onChange={(e) => setPagesLogged(e.target.value)}
          required
          dir="ltr"
          className="text-left h-11 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">من آية</Label>
          <Input
            type="number"
            min="1"
            max={selectedSurah?.ayahCount}
            value={ayahStart}
            onChange={(e) => setAyahStart(e.target.value)}
            required
            dir="ltr"
            className="text-left h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            إلى آية {selectedSurah ? `(${selectedSurah.ayahCount})` : ""}
          </Label>
          <Input
            type="number"
            min="1"
            max={selectedSurah?.ayahCount}
            value={ayahEnd}
            onChange={(e) => setAyahEnd(e.target.value)}
            required
            dir="ltr"
            className="text-left h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">ملاحظات (اختياري)</Label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="مثال: راجعت الصفحة 3 مرات"
          className="h-11 rounded-xl"
        />
      </div>

      <Button type="submit" className="w-full h-11 rounded-xl gap-2" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            جارٍ الحفظ...
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            تم التسجيل
          </>
        ) : todayLog ? "تحديث تسجيل اليوم" : "تسجيل الحفظ"}
      </Button>
    </form>
  );
}
