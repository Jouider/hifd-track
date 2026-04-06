import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lightbulb, ClipboardList, Calendar, CheckCircle2 } from "lucide-react";

function getReviewSchedule(logDate: Date): { due: Date; label: string }[] {
  const d = new Date(logDate);
  return [
    { due: addDays(d, 1), label: "مراجعة بعد يوم" },
    { due: addDays(d, 3), label: "مراجعة بعد 3 أيام" },
    { due: addDays(d, 7), label: "مراجعة بعد أسبوع" },
    { due: addDays(d, 14), label: "مراجعة بعد أسبوعين" },
    { due: addDays(d, 30), label: "مراجعة بعد شهر" },
  ];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default async function ReviewPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const logs = await db.dailyLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 30,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueReviews: {
    surahName: string;
    ayahStart: number;
    ayahEnd: number;
    label: string;
    logDate: Date;
  }[] = [];

  const upcomingReviews: typeof dueReviews = [];

  for (const log of logs) {
    const schedule = getReviewSchedule(log.date);
    for (const item of schedule) {
      const dueDate = new Date(item.due);
      dueDate.setHours(0, 0, 0, 0);

      const entry = {
        surahName: log.surahName,
        ayahStart: log.ayahStart,
        ayahEnd: log.ayahEnd,
        label: item.label,
        logDate: log.date,
      };

      if (dueDate.getTime() === today.getTime()) {
        dueReviews.push(entry);
      } else if (dueDate.getTime() > today.getTime() && dueDate.getTime() <= today.getTime() + 3 * 86400000) {
        upcomingReviews.push(entry);
      }
    }
  }

  const tips = [
    { title: "التقسيم", desc: "قسّم حفظك إلى مقاطع من 3-4 آيات" },
    { title: "التكرار 3x3", desc: "اقرأ 3 مرات بالنظر، ثم 3 مرات من الذاكرة" },
    { title: "الربط", desc: "اربط كل آية بمعناها وسياقها" },
    { title: "المراجعة المتكررة", desc: "راجع بعد 1 يوم، 3 أيام، أسبوع، أسبوعين، شهر" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">المراجعة</h1>
        <p className="text-sm text-muted-foreground">جدول المراجعة المتكررة لتثبيت الحفظ</p>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            نصائح الحفظ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{tip.title}</p>
                  <p className="text-xs text-muted-foreground">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Due Today */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
            مراجعات اليوم
          </CardTitle>
          <CardDescription className="text-xs">
            {dueReviews.length === 0 ? "لا توجد مراجعات مستحقة اليوم" : `${dueReviews.length} مراجعة مستحقة`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dueReviews.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-primary/40 mx-auto" />
              <p className="text-sm text-muted-foreground">أنت على اطلاع! لا مراجعات اليوم</p>
            </div>
          ) : (
            <div className="space-y-1">
              {dueReviews.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.surahName}</p>
                      <p className="text-xs text-muted-foreground">الآيات {r.ayahStart} - {r.ayahEnd}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{r.label}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            مراجعات قادمة
          </CardTitle>
          <CardDescription className="text-xs">خلال الأيام الثلاثة القادمة</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">لا توجد مراجعات قادمة</p>
          ) : (
            <div className="space-y-1">
              {upcomingReviews.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.surahName}</p>
                      <p className="text-xs text-muted-foreground">الآيات {r.ayahStart} - {r.ayahEnd}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{r.label}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
