import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, History } from "lucide-react";

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
      <div className="flex items-center gap-2">
        <History className="w-5 h-5 text-muted-foreground" />
        <h1 className="text-xl font-bold">سجل الحفظ</h1>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">لم تسجل أي حفظ بعد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{log.surahName}</p>
                      <p className="text-xs text-muted-foreground">
                        الآيات {log.ayahStart} - {log.ayahEnd} · {Number(log.pagesLogged)} صفحات
                      </p>
                      {log.notes && (
                        <p className="text-xs text-muted-foreground mt-0.5">{log.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-xs font-semibold text-primary">+{log.xpEarned} XP</p>
                    <p className="text-[10px] text-muted-foreground">
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
