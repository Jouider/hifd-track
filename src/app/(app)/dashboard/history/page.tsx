import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const logs = await db.dailyLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">سجل الحفظ</h1>

      {logs.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">لم تسجل أي حفظ بعد</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{log.surahName}</p>
                    <p className="text-sm text-muted-foreground">
                      الآيات {log.ayahStart} - {log.ayahEnd} · {Number(log.pagesLogged)} صفحات
                    </p>
                    {log.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{log.notes}</p>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-accent">+{log.xpEarned} XP</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.date).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
