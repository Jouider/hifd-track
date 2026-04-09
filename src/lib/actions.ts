"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateXP, calculateLevel } from "@/lib/quran-data";
import { revalidatePath } from "next/cache";

export async function logMemorization(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("غير مصرح");

  const surahNumber = parseInt(formData.get("surahNumber") as string);
  const surahName = formData.get("surahName") as string;
  const ayahStart = parseInt(formData.get("ayahStart") as string);
  const ayahEnd = parseInt(formData.get("ayahEnd") as string);
  const pagesLogged = parseFloat(formData.get("pagesLogged") as string);
  const notes = formData.get("notes") as string;

  if (!surahNumber || !ayahStart || !ayahEnd || !pagesLogged) {
    throw new Error("جميع الحقول مطلوبة");
  }

  // Find user's active challenge
  const participant = await db.challengeParticipant.findFirst({
    where: { userId: session.user.id },
    include: { challenge: true },
  });

  if (!participant) throw new Error("لم يتم العثور على تحدٍ نشط");

  const xpEarned = calculateXP(pagesLogged, surahNumber);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Upsert daily log
  await db.dailyLog.upsert({
    where: {
      userId_challengeId_date: {
        userId: session.user.id,
        challengeId: participant.challengeId,
        date: today,
      },
    },
    update: {
      surahNumber,
      surahName,
      ayahStart,
      ayahEnd,
      pagesLogged,
      notes,
      xpEarned,
    },
    create: {
      userId: session.user.id,
      challengeId: participant.challengeId,
      date: today,
      surahNumber,
      surahName,
      ayahStart,
      ayahEnd,
      pagesLogged,
      notes,
      xpEarned,
    },
  });

  // Update stats
  await updateUserStats(session.user.id, participant.challengeId);

  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");
}

async function updateUserStats(userId: string, challengeId: string) {
  const logs = await db.dailyLog.findMany({
    where: { userId, challengeId },
    orderBy: { date: "desc" },
  });

  const totalPages = logs.reduce((sum, log) => sum + Number(log.pagesLogged), 0);
  const totalXP = logs.reduce((sum, log) => sum + log.xpEarned, 0);

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedDates = logs
    .map((l) => {
      const d = new Date(l.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => b - a);

  for (let i = 0; i < sortedDates.length; i++) {
    const expected = today.getTime() - i * 86400000;
    if (sortedDates[i] === expected) {
      tempStreak++;
    } else {
      break;
    }
  }
  currentStreak = tempStreak;

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    if (sortedDates[i - 1] - sortedDates[i] === 86400000) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  const level = calculateLevel(totalXP);

  await db.userStats.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    update: { currentStreak, longestStreak, totalPages, totalXP, level },
    create: { userId, challengeId, currentStreak, longestStreak, totalPages, totalXP, level },
  });
}

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const participant = await db.challengeParticipant.findFirst({
    where: { userId: session.user.id },
    include: { challenge: { include: { milestones: { orderBy: { orderIndex: "asc" } } } } },
  });

  if (!participant) return null;

  const stats = await db.userStats.findUnique({
    where: { userId_challengeId: { userId: session.user.id, challengeId: participant.challengeId } },
  });

  const recentLogs = await db.dailyLog.findMany({
    where: { userId: session.user.id, challengeId: participant.challengeId },
    orderBy: { date: "desc" },
    take: 7,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLog = await db.dailyLog.findUnique({
    where: {
      userId_challengeId_date: {
        userId: session.user.id,
        challengeId: participant.challengeId,
        date: today,
      },
    },
  });

  return {
    challenge: participant.challenge,
    stats,
    recentLogs,
    todayLog,
  };
}

export async function updateSurahStatus(surahNumber: number, status: "NOT_STARTED" | "IN_REVISION" | "LEARNED") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("غير مصرح");

  const now = new Date();

  await db.surahProgress.upsert({
    where: { userId_surahNumber: { userId: session.user.id, surahNumber } },
    update: {
      status,
      ...(status === "LEARNED" ? { learnedAt: now } : {}),
    },
    create: {
      userId: session.user.id,
      surahNumber,
      status,
      ...(status === "LEARNED" ? { learnedAt: now } : {}),
    },
  });

  revalidatePath("/sourates");
  revalidatePath(`/sourates/${surahNumber}`);
  revalidatePath("/settings");
}

export async function addRevision(surahNumber: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("غير مصرح");

  const now = new Date();

  await db.surahProgress.upsert({
    where: { userId_surahNumber: { userId: session.user.id, surahNumber } },
    update: {
      revisionCount: { increment: 1 },
      lastRevisionAt: now,
      status: "IN_REVISION",
    },
    create: {
      userId: session.user.id,
      surahNumber,
      status: "IN_REVISION",
      revisionCount: 1,
      lastRevisionAt: now,
    },
  });

  revalidatePath("/sourates");
  revalidatePath(`/sourates/${surahNumber}`);
}

export async function getSurahProgressForUser() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.surahProgress.findMany({
    where: { userId: session.user.id },
  });
}

export async function getLeaderboardData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const participant = await db.challengeParticipant.findFirst({
    where: { userId: session.user.id },
  });

  if (!participant) return null;

  const participants = await db.challengeParticipant.findMany({
    where: { challengeId: participant.challengeId },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const stats = await db.userStats.findMany({
    where: { challengeId: participant.challengeId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { totalXP: "desc" },
  });

  const recentActivity = await db.dailyLog.findMany({
    where: { challengeId: participant.challengeId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return { participants, stats, recentActivity, currentUserId: session.user.id };
}
