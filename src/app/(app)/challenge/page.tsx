import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const milestoneIcons: Record<string, string> = {
  HIZB: "📗",
  JUZ: "📖",
  SURAH: "📜",
  FREE: "🎯",
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
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">لا يوجد تحدٍ</h2>
        <p className="text-muted-foreground">لم تنضم إلى أي تحدٍ بعد.</p>
      </div>
    );
  }

  const { challenge } = participant;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{challenge.name}</h1>
        <p className="text-muted-foreground text-sm">
          المشاركون: {challenge.participants.map((p) => p.user.name).join("، ")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>مسار الحفظ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-5 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
              {challenge.milestones.map((milestone, i) => (
                <div key={milestone.id} className="flex items-start gap-4 relative">
                  <div className="w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center text-lg z-10 shrink-0">
                    {milestoneIcons[milestone.type] || "📌"}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{milestone.labelAr}</p>
                      <Badge variant="outline" className="text-xs">
                        {milestone.type === "HIZB" ? "حزب" :
                         milestone.type === "JUZ" ? "جزء" :
                         milestone.type === "SURAH" ? "سورة" : "اختيار حر"}
                      </Badge>
                      {i === 0 && (
                        <Badge className="bg-primary text-xs">الحالي</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
