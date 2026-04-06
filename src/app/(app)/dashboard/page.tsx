import { getDashboardData } from "@/lib/actions";
import { getLevelTitle } from "@/lib/quran-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LogForm } from "@/components/log-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, Star, BookOpen, Award, ChevronLeft, CheckCircle2, Clock } from "lucide-react";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold">لم تنضم إلى أي تحدٍ بعد</h2>
        <p className="text-muted-foreground text-sm">تواصل مع مدير التحدي لإضافتك</p>
      </div>
    );
  }

  const { stats, recentLogs, todayLog, challenge } = data;
  const level = stats?.level || 1;
  const title = getLevelTitle(level);
  const xpInLevel = (stats?.totalXP || 0) % 100;

  return (
    <div className="space-y-6">
      {/* Greeting + Status */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">{challenge.name}</p>
        </div>
        {todayLog ? (
          <Badge variant="secondary" className="gap-1.5 bg-primary/10 text-primary border-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تم التسجيل
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            لم تسجل بعد
          </Badge>
        )}
      </div>

      {/* Stats Grid - 2x2 on mobile */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm bg-orange-50">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats?.currentStreak || 0}</p>
                <p className="text-xs text-orange-500/80">أيام متتالية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-amber-50">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats?.totalXP || 0}</p>
                <p className="text-xs text-amber-500/80">نقاط الخبرة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-primary/5">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{Number(stats?.totalPages || 0).toFixed(1)}</p>
                <p className="text-xs text-primary/60">صفحات محفوظة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-violet-50">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-600">{stats?.longestStreak || 0}</p>
                <p className="text-xs text-violet-500/80">أطول سلسلة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">المستوى {level}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-muted-foreground">{xpInLevel}/100 XP</span>
          </div>
          <Progress value={xpInLevel} className="h-2" />
        </CardContent>
      </Card>

      {/* Log Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">تسجيل حفظ اليوم</CardTitle>
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
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">النشاط الأخير</CardTitle>
          <Link href="/dashboard/history">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
              عرض الكل
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">لا يوجد نشاط بعد</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{log.surahName}</p>
                      <p className="text-xs text-muted-foreground">
                        الآيات {log.ayahStart} - {log.ayahEnd}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-primary">+{log.xpEarned} XP</p>
                    <p className="text-[10px] text-muted-foreground">
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
