import { getLeaderboardData } from "@/lib/actions";
import { getLevelTitle } from "@/lib/quran-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, BookOpen, Star, Activity } from "lucide-react";

export default async function LeaderboardPage() {
  const data = await getLeaderboardData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Trophy className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">لم تنضم إلى تحدٍ بعد</p>
      </div>
    );
  }

  const { stats, recentActivity, currentUserId } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">المتصدرون</h1>

      {/* Rankings */}
      <div className="space-y-3">
        {stats.map((s, i) => {
          const isCurrentUser = s.userId === currentUserId;
          return (
            <Card key={s.id} className={isCurrentUser ? "border-primary/30 bg-primary/5" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    i === 0 ? "bg-amber-100 text-amber-600" :
                    i === 1 ? "bg-gray-100 text-gray-500" :
                    i === 2 ? "bg-orange-100 text-orange-500" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>

                  <Avatar className="w-10 h-10">
                    <AvatarImage src={s.user.image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {s.user.name?.charAt(0) || "م"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{s.user.name}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                        {getLevelTitle(s.level)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">المستوى {s.level}</p>
                  </div>

                  {/* Stats - compact on mobile */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <p className="text-sm font-bold">{s.totalXP}</p>
                      <div className="flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] text-muted-foreground">XP</span>
                      </div>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-sm font-bold">{Number(s.totalPages).toFixed(1)}</p>
                      <div className="flex items-center justify-center gap-0.5">
                        <BookOpen className="w-3 h-3 text-primary" />
                        <span className="text-[10px] text-muted-foreground">صفحات</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">{s.currentStreak}</p>
                      <div className="flex items-center justify-center gap-0.5">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span className="text-[10px] text-muted-foreground">سلسلة</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {stats.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <Trophy className="w-8 h-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm text-muted-foreground">لا توجد بيانات بعد. ابدأ بتسجيل حفظك!</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            آخر النشاطات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center text-sm py-6">لا يوجد نشاط</p>
          ) : (
            <div className="space-y-1">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{log.user.name}</span>
                    <span className="text-muted-foreground">حفظ</span>
                    <span className="font-medium">{log.surahName}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
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
