"use client";

import { useState } from "react";
import { logMemorization } from "@/lib/actions";
import { surahs } from "@/lib/quran-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>السورة</Label>
          <select
            value={surahNumber}
            onChange={(e) => {
              setSurahNumber(e.target.value);
              setAyahEnd("");
            }}
            className="w-full h-10 rounded-md border border-input bg-input px-3 text-sm"
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
          <Label>عدد الصفحات</Label>
          <Input
            type="number"
            step="0.5"
            min="0.5"
            value={pagesLogged}
            onChange={(e) => setPagesLogged(e.target.value)}
            required
            dir="ltr"
            className="text-left"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>من آية</Label>
          <Input
            type="number"
            min="1"
            max={selectedSurah?.ayahCount}
            value={ayahStart}
            onChange={(e) => setAyahStart(e.target.value)}
            required
            dir="ltr"
            className="text-left"
          />
        </div>
        <div className="space-y-2">
          <Label>إلى آية {selectedSurah ? `(${selectedSurah.ayahCount} آية)` : ""}</Label>
          <Input
            type="number"
            min="1"
            max={selectedSurah?.ayahCount}
            value={ayahEnd}
            onChange={(e) => setAyahEnd(e.target.value)}
            required
            dir="ltr"
            className="text-left"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>ملاحظات (اختياري)</Label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="مثال: راجعت الصفحة 3 مرات"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جارٍ الحفظ..." : success ? "✓ تم التسجيل!" : todayLog ? "تحديث تسجيل اليوم" : "تسجيل الحفظ"}
      </Button>
    </form>
  );
}
