import { getSurahProgressForUser } from "@/lib/actions";
import { getSurahByNumber } from "@/lib/quran-data";
import { notFound } from "next/navigation";
import { SurahDetail } from "./surah-detail";

interface Props {
  params: Promise<{ number: string }>;
}

export default async function SurahPage({ params }: Props) {
  const { number } = await params;
  const num = parseInt(number);

  if (isNaN(num) || num < 1 || num > 114) notFound();

  const surah = getSurahByNumber(num);
  if (!surah) notFound();

  const allProgress = await getSurahProgressForUser();
  const progress = allProgress.find((p) => p.surahNumber === num) ?? null;

  return <SurahDetail surah={surah} progress={progress} />;
}
