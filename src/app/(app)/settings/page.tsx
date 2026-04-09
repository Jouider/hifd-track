import { auth } from "@/lib/auth";
import { getSurahProgressForUser } from "@/lib/actions";
import { surahs } from "@/lib/quran-data";
import { ProfileClient } from "./profile-client";

export default async function SettingsPage() {
  const session = await auth();
  const progress = await getSurahProgressForUser();
  const progressMap = new Map(progress.map((p) => [p.surahNumber, p]));

  const surateStats = surahs.map((s) => ({
    number: s.number,
    nameAr: s.nameAr,
    status: progressMap.get(s.number)?.status ?? "NOT_STARTED",
    revisionCount: progressMap.get(s.number)?.revisionCount ?? 0,
  }));

  const learned = surateStats.filter((s) => s.status === "LEARNED").length;
  const inRevision = surateStats.filter((s) => s.status === "IN_REVISION").length;

  return (
    <ProfileClient
      user={session?.user ?? null}
      surateStats={surateStats}
      learned={learned}
      inRevision={inRevision}
    />
  );
}
