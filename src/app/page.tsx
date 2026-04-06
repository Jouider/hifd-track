import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, BookOpen, ArrowLeft, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="text-xl font-bold text-primary">حفظ تراك</span>
        <Link href="/login">
          <Button variant="ghost" size="sm">تسجيل الدخول</Button>
        </Link>
      </header>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Illustration area */}
          <div className="mx-auto w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary" strokeWidth={1.5} />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              احفظ القرآن مع أصدقائك
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              تتبع تقدمك، حافظ على سلسلتك اليومية، وتنافس في تحدي الحفظ
            </p>
          </div>

          <Link href="/login" className="block">
            <Button size="lg" className="w-full text-lg py-6 gap-2">
              ابدأ التحدي
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border text-right">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">سلسلة يومية</h3>
                <p className="text-sm text-muted-foreground">حافظ على نصف صفحة يوميا وابنِ عادة قوية</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border text-right">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">تحدي الأصدقاء</h3>
                <p className="text-sm text-muted-foreground">تنافس مع أصدقائك وتابع تقدمكم معا</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border text-right">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">مراجعة ذكية</h3>
                <p className="text-sm text-muted-foreground">جدول مراجعة متكررة لتثبيت حفظك</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-5 text-center text-sm text-muted-foreground">
        حفظ تراك - لحفظة القرآن الكريم
      </footer>
    </div>
  );
}
