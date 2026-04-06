import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  // Calculate due reviews
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">المراجعة</h1>
        <p className="text-muted-foreground text-sm">
          جدول المراجعة المتكررة لتثبيت الحفظ
        </p>
      </div>

      {/* Strategy Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 نصائح الحفظ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-2">
            <span className="text-primary font-bold">1.</span>
            <p><strong>التقسيم:</strong> قسّم حفظك إلى مقاطع من 3-4 آيات</p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary font-bold">2.</span>
            <p><strong>التكرار 3×3:</strong> اقرأ 3 مرات بالنظر، ثم 3 مرات من الذاكرة</p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary font-bold">3.</span>
            <p><strong>الربط:</strong> اربط كل آية بمعناها وسياقها</p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary font-bold">4.</span>
            <p><strong>المراجعة المتكررة:</strong> راجع بعد 1 يوم، 3 أيام، أسبوع، أسبوعين، شهر</p>
          </div>
        </CardContent>
      </Card>

      {/* Due Today */}
      <Card>
        <CardHeader>
          <CardTitle>📋 مراجعات اليوم</CardTitle>
          <CardDescription>
            {dueReviews.length === 0 ? "لا توجد مراجعات مستحقة اليوم" : `${dueReviews.length} مراجعة مستحقة`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dueReviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">🎉 أنت على اطلاع! لا مراجعات اليوم.</p>
          ) : (
            <div className="space-y-3">
              {dueReviews.map((r, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{r.surahName}</p>
                    <p className="text-sm text-muted-foreground">
                      الآيات {r.ayahStart} - {r.ayahEnd}
                    </p>
                  </div>
                  <Badge variant="outline">{r.label}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming */}
      <Card>
        <CardHeader>
          <CardTitle>📅 مراجعات قادمة</CardTitle>
          <CardDescription>خلال الأيام الثلاثة القادمة</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingReviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">لا توجد مراجعات قادمة</p>
          ) : (
            <div className="space-y-3">
              {upcomingReviews.map((r, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{r.surahName}</p>
                    <p className="text-sm text-muted-foreground">
                      الآيات {r.ayahStart} - {r.ayahEnd}
                    </p>
                  </div>
                  <Badge variant="secondary">{r.label}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
