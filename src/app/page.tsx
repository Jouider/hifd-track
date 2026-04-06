import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-primary">
              حفظ تراك
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              احفظ معًا، انمُ معًا
            </p>
          </div>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            تحدى أصدقاءك في حفظ القرآن الكريم. تتبع تقدمك، حافظ على سلسلة
            الحفظ اليومية، واكسب نقاط الخبرة مع كل صفحة تحفظها.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                ابدأ التحدي
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="space-y-2 p-4 rounded-xl bg-card/50">
              <div className="text-3xl">🔥</div>
              <h3 className="font-bold">سلسلة يومية</h3>
              <p className="text-sm text-muted-foreground">
                حافظ على حفظ نصف صفحة يوميًا وابنِ عادة قوية
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-card/50">
              <div className="text-3xl">🏆</div>
              <h3 className="font-bold">تحدي الأصدقاء</h3>
              <p className="text-sm text-muted-foreground">
                تنافس مع أصدقائك وتابع تقدمكم جنبًا إلى جنب
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-card/50">
              <div className="text-3xl">📖</div>
              <h3 className="font-bold">مراجعة ذكية</h3>
              <p className="text-sm text-muted-foreground">
                جدول مراجعة متكررة يُثبّت حفظك بأفضل الطرق
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>حفظ تراك — بُني بـ ❤️ لحفظة القرآن الكريم</p>
      </footer>
    </div>
  );
}
