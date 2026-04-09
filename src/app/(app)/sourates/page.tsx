import { getSurahProgressForUser } from "@/lib/actions";
import { surahs } from "@/lib/quran-data";
import { SuratesList } from "./sourates-list";

export default async function SouratesPage() {
  const progress = await getSurahProgressForUser();

  const progressMap = new Map(progress.map((p) => [p.surahNumber, p]));

  const suratesWithProgress = surahs.map((s) => ({
    ...s,
    progress: progressMap.get(s.number) ?? null,
  }));

  return <SuratesList surates={suratesWithProgress} />;
}
