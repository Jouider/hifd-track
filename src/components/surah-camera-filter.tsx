"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, CameraOff, RefreshCw, X } from "lucide-react";
import { surahs } from "@/lib/quran-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SurahCameraFilter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [fromSurah, setFromSurah] = useState(78); // default: Juz Amma
  const [toSurah, setToSurah] = useState(114);
  const [active, setActive] = useState(false);
  const [currentSurah, setCurrentSurah] = useState<(typeof surahs)[0] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const pickRandom = useCallback((from: number, to: number) => {
    const range = surahs.filter((s) => s.number >= from && s.number <= to);
    if (range.length === 0) return null;
    return range[Math.floor(Math.random() * range.length)];
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setActive(true);
      setCurrentSurah(pickRandom(fromSurah, toSurah));
    } catch {
      setError("لم يتمكن التطبيق من الوصول إلى الكاميرا. تأكد من منح الإذن.");
    }
  }, [fromSurah, toSurah, pickRandom]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
    setCurrentSurah(null);
  }, []);

  const nextSurah = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSurah(pickRandom(fromSurah, toSurah));
      setAnimating(false);
    }, 200);
  }, [fromSurah, toSurah, pickRandom]);

  // Cleanup on unmount
  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  const rangeValid = fromSurah <= toSurah;
  const rangeCount = surahs.filter((s) => s.number >= fromSurah && s.number <= toSurah).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          فلتر السور
        </CardTitle>
        <CardDescription className="text-xs">
          اختر نطاق السور ثم افتح الكاميرا لتظهر سورة عشوائية للتلاوة
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Range selector */}
        {!active && (
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-muted-foreground">من سورة</label>
              <select
                value={fromSurah}
                onChange={(e) => setFromSurah(Number(e.target.value))}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {surahs.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-xs text-muted-foreground">إلى سورة</label>
              <select
                value={toSurah}
                onChange={(e) => setToSurah(Number(e.target.value))}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {surahs.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {!rangeValid && (
          <p className="text-xs text-destructive">يجب أن تكون سورة البداية قبل سورة النهاية</p>
        )}

        {error && (
          <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Camera view */}
        {active && (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] w-full max-w-sm mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* Surah overlay */}
            {currentSurah && (
              <div
                className={`absolute inset-x-0 bottom-16 flex flex-col items-center gap-1 px-4 transition-all duration-200 ${
                  animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                {/* Decorative top line */}
                <div className="flex items-center gap-2 w-full justify-center">
                  <div className="h-px flex-1 bg-white/40" />
                  <span className="text-white/70 text-[10px] font-light tracking-widest">
                    سورة رقم {currentSurah.number}
                  </span>
                  <div className="h-px flex-1 bg-white/40" />
                </div>

                {/* Arabic name */}
                <div
                  className="rounded-2xl px-6 py-3 text-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <p className="text-white text-3xl font-bold" style={{ fontFamily: "var(--font-amiri)" }}>
                    {currentSurah.nameAr}
                  </p>
                  <p className="text-white/70 text-sm mt-1">{currentSurah.name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{currentSurah.ayahCount} آية</p>
                </div>
              </div>
            )}

            {/* Controls overlay */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-3 pt-2"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
            >
              <button
                onClick={stopCamera}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={nextSurah}
                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <RefreshCw className="w-6 h-6 text-white" />
              </button>

              <div className="w-10 h-10" />
            </div>
          </div>
        )}

        {/* Start button */}
        {!active && (
          <Button
            onClick={startCamera}
            disabled={!rangeValid}
            className="w-full gap-2"
          >
            <Camera className="w-4 h-4" />
            تشغيل الكاميرا
            {rangeValid && <span className="opacity-60 text-xs">({rangeCount} سورة)</span>}
          </Button>
        )}

        {/* Hint */}
        {!active && (
          <p className="text-center text-xs text-muted-foreground">
            ستظهر سورة عشوائية من النطاق المحدد على الكاميرا • اضغط
            <RefreshCw className="w-3 h-3 inline mx-1" />
            للسورة التالية
          </p>
        )}
      </CardContent>
    </Card>
  );
}
