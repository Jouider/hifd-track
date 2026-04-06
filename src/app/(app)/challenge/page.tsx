import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, BookOpen, BookMarked, Layers, Compass, Users } from "lucide-react";

const milestoneIcons: Record<string, typeof BookOpen> = {
  HIZB: Layers,
  JUZ: BookMarked,
  SURAH: BookOpen,
  FREE: Compass,
};

const milestoneLabels: Record<string, string> = {
  HIZB: "حزب",
  JUZ: "جزء",
  SURAH: "سورة",
  FREE: "اختيار حر",
};

export default async function ChallengePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const participant = await db.challengeParticipant.findFirst({
    where: { userId: session.user.id },
    include: {
      challenge: {
        include: {
          milestones: { orderBy: { orderIndex: "asc" } },
          participants: {
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (!participant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Target className="w-10 h-10 text-muted-foreground/40" />
        <h2 className="text-lg font-bold">لا يوجد تحدٍ</h2>
        <p className="text-sm text-muted-foreground">لم تنضم إلى أي تحدٍ بعد</p>
      </div>
    );
  }

  const { challenge } = participant;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{challenge.name}</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {challenge.participants.map((p) => p.user.name).join("، ")}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            مسار الحفظ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-[19px] top-5 bottom-5 w-0.5 bg-border" />

            <div className="space-y-5">
              {challenge.milestones.map((milestone, i) => {
                const Icon = milestoneIcons[milestone.type] || BookOpen;
                return (
                  <div key={milestone.id} className="flex items-start gap-4 relative">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 shrink-0 ${
                      i === 0 ? "bg-primary text-white" : "bg-card border-2 border-border"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{milestone.labelAr}</p>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {milestoneLabels[milestone.type]}
                        </Badge>
                        {i === 0 && (
                          <Badge className="bg-primary text-[10px] px-1.5 py-0">الحالي</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {milestone.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
