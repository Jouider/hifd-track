import { getDashboardData } from "@/lib/actions";
import { getLevelTitle } from "@/lib/quran-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LogForm } from "@/components/log-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">مرحبًا بك في حفظ تراك!</h2>
        <p className="text-muted-foreground">لم تنضم إلى أي تحدٍ بعد.</p>
        <p className="text-sm text-muted-foreground">
          تواصل مع مدير التحدي لإضافتك.
        </p>
      </div>
    );
  }

  const { stats, recentLogs, todayLog, challenge } = data;
  const level = stats?.level || 1;
  const title = getLevelTitle(level);
  const xpInLevel = (stats?.totalXP || 0) % 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground text-sm">{challenge.name}</p>
        </div>
        {todayLog ? (
          <Badge variant="secondary" className="text-emerald gap-1">
            ✓ تم التسجيل اليوم
          </Badge>
        ) : (
          <Badge variant="outline" className="text-accent gap-1">
            ⏳ لم تسجل اليوم بعد
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {stats?.currentStreak || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">🔥 أيام متتالية</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent">
              {stats?.totalXP || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">⭐ نقاط الخبرة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">
              {Number(stats?.totalPages || 0).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">📖 صفحات محفوظة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {stats?.longestStreak || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">🏆 أطول سلسلة</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary">{title}</Badge>
              <span className="text-sm text-muted-foreground">المستوى {level}</span>
            </div>
            <span className="text-sm text-muted-foreground">{xpInLevel}/100 XP</span>
          </div>
          <Progress value={xpInLevel} className="h-2" />
        </CardContent>
      </Card>

      {/* Log Form */}
      <Card>
        <CardHeader>
          <CardTitle>تسجيل حفظ اليوم</CardTitle>
        </CardHeader>
        <CardContent>
          <LogForm todayLog={todayLog ? {
            surahNumber: todayLog.surahNumber,
            ayahStart: todayLog.ayahStart,
            ayahEnd: todayLog.ayahEnd,
            pagesLogged: Number(todayLog.pagesLogged),
            notes: todayLog.notes,
          } : null} />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>النشاط الأخير</CardTitle>
          <Link href="/dashboard/history">
            <Button variant="ghost" size="sm">عرض الكل</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">لا يوجد نشاط بعد</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{log.surahName}</p>
                    <p className="text-sm text-muted-foreground">
                      الآيات {log.ayahStart} - {log.ayahEnd}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">+{log.xpEarned} XP</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.date).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
