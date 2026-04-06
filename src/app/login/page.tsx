"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result) {
        setError("حدث خطأ غير متوقع");
        setLoading(false);
        return;
      }

      if (result.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError("حدث خطأ: " + (err instanceof Error ? err.message : "حاول مرة أخرى"));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-primary">حفظ تراك</h1>
          <p className="text-sm text-muted-foreground">احفظ معا، انمُ معا</p>
        </div>

        <Card>
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-lg">{isRegister ? "إنشاء حساب جديد" : "تسجيل الدخول"}</CardTitle>
            <CardDescription className="text-xs">
              {isRegister
                ? "سجل حسابك وابدأ تحدي الحفظ"
                : "أدخل بياناتك للمتابعة"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl gap-2"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              تسجيل الدخول بـ Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">أو</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegister && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">الاسم</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك"
                    required={isRegister}
                    className="h-11 rounded-xl"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  dir="ltr"
                  className="text-left h-11 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6 أحرف على الأقل"
                  dir="ltr"
                  className="text-left h-11 rounded-xl"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-destructive text-center py-1">{error}</p>
              )}

              <Button type="submit" className="w-full h-11 rounded-xl gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جارٍ المعالجة...
                  </>
                ) : isRegister ? "إنشاء الحساب" : "تسجيل الدخول"}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground pt-1">
              {isRegister ? "لديك حساب بالفعل؟" : "ليس لديك حساب؟"}{" "}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="text-primary hover:underline font-medium"
              >
                {isRegister ? "تسجيل الدخول" : "إنشاء حساب"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
