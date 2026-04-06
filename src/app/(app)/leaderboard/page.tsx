import { getLeaderboardData } from "@/lib/actions";
import { getLevelTitle } from "@/lib/quran-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function LeaderboardPage() {
  const data = await getLeaderboardData();

  if (!data) {
    return <p className="text-center py-20 text-muted-foreground">لم تنضم إلى تحدٍ بعد</p>;
  }

  const { stats, recentActivity, currentUserId } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">المتصدرون</h1>

      {/* Rankings */}
      <div className="grid gap-4">
        {stats.map((s, i) => {
          const isCurrentUser = s.userId === currentUserId;
          return (
            <Card key={s.id} className={isCurrentUser ? "border-primary/50 bg-primary/5" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-muted-foreground w-10 text-center">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </div>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={s.user.image || undefined} />
                    <AvatarFallback>{s.user.name?.charAt(0) || "م"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg">{s.user.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {getLevelTitle(s.level)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      المستوى {s.level}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-xl font-bold text-accent">{s.totalXP}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{Number(s.totalPages).toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">صفحات</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-primary">{s.currentStreak}</p>
                      <p className="text-xs text-muted-foreground">🔥 سلسلة</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {stats.length === 0 && (
          <p className="text-center py-10 text-muted-foreground">لا توجد بيانات بعد. ابدأ بتسجيل حفظك!</p>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>آخر النشاطات</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">لا يوجد نشاط</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.user.name}</span>
                    <span className="text-muted-foreground">حفظ</span>
                    <span className="font-medium">{log.surahName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
