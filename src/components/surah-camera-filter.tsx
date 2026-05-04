"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, Video, Square, Download, Trash2, X, RefreshCw } from "lucide-react";
import { surahs } from "@/lib/quran-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Phase = "setup" | "camera" | "recording" | "done";

export function SurahCameraFilter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [phase, setPhase] = useState<Phase>("setup");
  const [fromSurah, setFromSurah] = useState(78);
  const [toSurah, setToSurah] = useState(114);
  const [currentSurah, setCurrentSurah] = useState<(typeof surahs)[0] | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("video/webm");
  const [error, setError] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Assign stream to video once video element is rendered
  useEffect(() => {
    if (phase === "camera" || phase === "recording") {
      const vid = videoRef.current;
      const stream = streamRef.current;
      if (vid && stream) {
        vid.srcObject = stream;
        vid.play().catch(() => {});
      }
    }
  }, [phase]);

  // Recording timer
  useEffect(() => {
    if (phase !== "recording") return;
    setRecordingTime(0);
    const id = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Cleanup stream + object URL on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const pickRandom = useCallback((from: number, to: number) => {
    const range = surahs.filter((s) => s.number >= from && s.number <= to);
    return range.length ? range[Math.floor(Math.random() * range.length)] : null;
  }, []);

  const openCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true,
      });
      streamRef.current = stream;
      setCurrentSurah(pickRandom(fromSurah, toSurah));
      setPhase("camera"); // video useEffect fires after this render
    } catch {
      setError("تعذّر الوصول إلى الكاميرا. تأكد من منح الإذن.");
    }
  }, [fromSurah, toSurah, pickRandom]);

  const startRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;

    const type = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "video/mp4";

    setMimeType(type);
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream, { mimeType: type });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type });
      const url = URL.createObjectURL(blob);
      setRecordingUrl(url);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setPhase("done");
    };

    recorder.start(100);
    recorderRef.current = recorder;
    setPhase("recording");
  }, []);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
  }, []);

  const saveVideo = useCallback(() => {
    if (!recordingUrl || !currentSurah) return;
    const ext = mimeType.includes("mp4") ? "mp4" : "webm";
    const a = document.createElement("a");
    a.href = recordingUrl;
    a.download = `tilawa-${currentSurah.nameAr}-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [recordingUrl, currentSurah, mimeType]);

  const discard = useCallback(() => {
    if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    setRecordingUrl(null);
    setCurrentSurah(null);
    setPhase("setup");
  }, [recordingUrl]);

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setPhase("setup");
  }, []);

  const nextSurah = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSurah(pickRandom(fromSurah, toSurah));
      setAnimating(false);
    }, 200);
  }, [fromSurah, toSurah, pickRandom]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const rangeValid = fromSurah <= toSurah;
  const rangeCount = surahs.filter((s) => s.number >= fromSurah && s.number <= toSurah).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          فلتر التلاوة
        </CardTitle>
        <CardDescription className="text-xs">
          سجّل تلاوتك مع عرض سورة عشوائية من النطاق المحدد
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── SETUP ── */}
        {phase === "setup" && (
          <>
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

            {!rangeValid && (
              <p className="text-xs text-destructive">يجب أن تكون سورة البداية قبل سورة النهاية</p>
            )}
            {error && (
              <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button onClick={openCamera} disabled={!rangeValid} className="w-full gap-2">
              <Camera className="w-4 h-4" />
              فتح الكاميرا
              {rangeValid && (
                <span className="opacity-60 text-xs">({rangeCount} سورة)</span>
              )}
            </Button>
          </>
        )}

        {/* ── CAMERA + RECORDING ── */}
        {(phase === "camera" || phase === "recording") && (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] w-full max-w-sm mx-auto">
            {/* Live camera feed — mirrored like a selfie */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />

            {/* Recording badge */}
            {phase === "recording" && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-xs font-mono">{fmt(recordingTime)}</span>
              </div>
            )}

            {/* Surah overlay */}
            {currentSurah && (
              <div
                className={`absolute inset-x-0 bottom-20 flex flex-col items-center gap-1 px-4 z-10 transition-all duration-200 ${
                  animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <div className="flex items-center gap-2 w-full justify-center">
                  <div className="h-px flex-1 bg-white/40" />
                  <span className="text-white/70 text-[10px] tracking-widest">
                    سورة رقم {currentSurah.number}
                  </span>
                  <div className="h-px flex-1 bg-white/40" />
                </div>
                <div
                  className="rounded-2xl px-6 py-3 text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <p
                    className="text-white text-3xl font-bold"
                    style={{ fontFamily: "var(--font-amiri)" }}
                  >
                    {currentSurah.nameAr}
                  </p>
                  <p className="text-white/70 text-sm mt-0.5">{currentSurah.name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{currentSurah.ayahCount} آية</p>
                </div>
              </div>
            )}

            {/* Bottom controls */}
            <div
              className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-5 pt-10 z-10"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
              }}
            >
              {phase === "camera" ? (
                <>
                  {/* Close */}
                  <button
                    onClick={closeCamera}
                    className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {/* Record */}
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-xl active:scale-95 transition-transform border-4 border-white/30"
                  >
                    <Video className="w-7 h-7 text-white" />
                  </button>

                  {/* Next surah */}
                  <button
                    onClick={nextSurah}
                    className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    <RefreshCw className="w-4 h-4 text-white" />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-11" />
                  {/* Stop */}
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl active:scale-95 transition-transform"
                  >
                    <Square className="w-6 h-6 text-red-500 fill-red-500" />
                  </button>
                  <div className="w-11" />
                </>
              )}
            </div>
          </div>
        )}

        {/* ── DONE — preview + save/discard ── */}
        {phase === "done" && recordingUrl && (
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden bg-black aspect-[3/4] w-full max-w-sm mx-auto">
              <video
                src={recordingUrl}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {currentSurah && (
              <p className="text-center text-sm text-muted-foreground">
                تلاوة سورة <strong className="text-foreground">{currentSurah.nameAr}</strong>
              </p>
            )}

            <div className="flex gap-3">
              <Button onClick={saveVideo} className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                حفظ الفيديو
              </Button>
              <Button
                variant="outline"
                onClick={discard}
                className="flex-1 gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
