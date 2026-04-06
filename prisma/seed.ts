import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create the challenge
  const challenge = await prisma.challenge.upsert({
    where: { id: "main-challenge" },
    update: {},
    create: {
      id: "main-challenge",
      name: "تحدي عبدالله وسلمى",
    },
  });

  // Create milestones
  const milestones = [
    { orderIndex: 1, type: "HIZB" as const, reference: "hizb_subh", label: "Hizb Subh", labelAr: "حزب سبح" },
    { orderIndex: 2, type: "HIZB" as const, reference: "hizb_by_hizb", label: "Hizb by Hizb", labelAr: "حزب تلو حزب" },
    { orderIndex: 3, type: "JUZ" as const, reference: "juz_30", label: "Juz Amma", labelAr: "جزء عم" },
    { orderIndex: 4, type: "SURAH" as const, reference: "surah_2", label: "Al-Baqarah", labelAr: "سورة البقرة" },
    { orderIndex: 5, type: "SURAH" as const, reference: "surah_3", label: "Aal-Imran", labelAr: "سورة آل عمران" },
    { orderIndex: 6, type: "SURAH" as const, reference: "surah_67", label: "Al-Mulk", labelAr: "سورة الملك" },
    { orderIndex: 7, type: "SURAH" as const, reference: "surah_18", label: "Al-Kahf", labelAr: "سورة الكهف" },
    { orderIndex: 8, type: "SURAH" as const, reference: "surah_36", label: "Ya-Sin", labelAr: "سورة يس" },
    { orderIndex: 9, type: "FREE" as const, reference: "free_choice", label: "Free Choice", labelAr: "اختيار حر" },
  ];

  for (const m of milestones) {
    await prisma.challengeMilestone.upsert({
      where: {
        challengeId_orderIndex: {
          challengeId: challenge.id,
          orderIndex: m.orderIndex,
        },
      },
      update: m,
      create: {
        ...m,
        challengeId: challenge.id,
      },
    });
  }

  console.log("✅ Seed completed: challenge and milestones created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
