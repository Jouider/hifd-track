export interface Surah {
  number: number;
  name: string;
  nameAr: string;
  ayahCount: number;
  pages: number;
}

export const surahs: Surah[] = [
  { number: 1, name: "Al-Fatihah", nameAr: "الفاتحة", ayahCount: 7, pages: 1 },
  { number: 2, name: "Al-Baqarah", nameAr: "البقرة", ayahCount: 286, pages: 48 },
  { number: 3, name: "Aal-Imran", nameAr: "آل عمران", ayahCount: 200, pages: 32 },
  { number: 4, name: "An-Nisa", nameAr: "النساء", ayahCount: 176, pages: 28 },
  { number: 5, name: "Al-Ma'idah", nameAr: "المائدة", ayahCount: 120, pages: 22 },
  { number: 6, name: "Al-An'am", nameAr: "الأنعام", ayahCount: 165, pages: 23 },
  { number: 7, name: "Al-A'raf", nameAr: "الأعراف", ayahCount: 206, pages: 24 },
  { number: 8, name: "Al-Anfal", nameAr: "الأنفال", ayahCount: 75, pages: 10 },
  { number: 9, name: "At-Tawbah", nameAr: "التوبة", ayahCount: 129, pages: 20 },
  { number: 10, name: "Yunus", nameAr: "يونس", ayahCount: 109, pages: 14 },
  { number: 11, name: "Hud", nameAr: "هود", ayahCount: 123, pages: 14 },
  { number: 12, name: "Yusuf", nameAr: "يوسف", ayahCount: 111, pages: 12 },
  { number: 13, name: "Ar-Ra'd", nameAr: "الرعد", ayahCount: 43, pages: 6 },
  { number: 14, name: "Ibrahim", nameAr: "إبراهيم", ayahCount: 52, pages: 6 },
  { number: 15, name: "Al-Hijr", nameAr: "الحجر", ayahCount: 99, pages: 6 },
  { number: 16, name: "An-Nahl", nameAr: "النحل", ayahCount: 128, pages: 16 },
  { number: 17, name: "Al-Isra", nameAr: "الإسراء", ayahCount: 111, pages: 12 },
  { number: 18, name: "Al-Kahf", nameAr: "الكهف", ayahCount: 110, pages: 12 },
  { number: 19, name: "Maryam", nameAr: "مريم", ayahCount: 98, pages: 6 },
  { number: 20, name: "Taha", nameAr: "طه", ayahCount: 135, pages: 8 },
  { number: 21, name: "Al-Anbiya", nameAr: "الأنبياء", ayahCount: 112, pages: 10 },
  { number: 22, name: "Al-Hajj", nameAr: "الحج", ayahCount: 78, pages: 10 },
  { number: 23, name: "Al-Mu'minun", nameAr: "المؤمنون", ayahCount: 118, pages: 8 },
  { number: 24, name: "An-Nur", nameAr: "النور", ayahCount: 64, pages: 10 },
  { number: 25, name: "Al-Furqan", nameAr: "الفرقان", ayahCount: 77, pages: 6 },
  { number: 26, name: "Ash-Shu'ara", nameAr: "الشعراء", ayahCount: 227, pages: 10 },
  { number: 27, name: "An-Naml", nameAr: "النمل", ayahCount: 93, pages: 8 },
  { number: 28, name: "Al-Qasas", nameAr: "القصص", ayahCount: 88, pages: 10 },
  { number: 29, name: "Al-Ankabut", nameAr: "العنكبوت", ayahCount: 69, pages: 8 },
  { number: 30, name: "Ar-Rum", nameAr: "الروم", ayahCount: 60, pages: 6 },
  { number: 31, name: "Luqman", nameAr: "لقمان", ayahCount: 34, pages: 4 },
  { number: 32, name: "As-Sajdah", nameAr: "السجدة", ayahCount: 30, pages: 2 },
  { number: 33, name: "Al-Ahzab", nameAr: "الأحزاب", ayahCount: 73, pages: 10 },
  { number: 34, name: "Saba", nameAr: "سبأ", ayahCount: 54, pages: 6 },
  { number: 35, name: "Fatir", nameAr: "فاطر", ayahCount: 45, pages: 6 },
  { number: 36, name: "Ya-Sin", nameAr: "يس", ayahCount: 83, pages: 6 },
  { number: 37, name: "As-Saffat", nameAr: "الصافات", ayahCount: 182, pages: 6 },
  { number: 38, name: "Sad", nameAr: "ص", ayahCount: 88, pages: 6 },
  { number: 39, name: "Az-Zumar", nameAr: "الزمر", ayahCount: 75, pages: 10 },
  { number: 40, name: "Ghafir", nameAr: "غافر", ayahCount: 85, pages: 10 },
  { number: 41, name: "Fussilat", nameAr: "فصلت", ayahCount: 54, pages: 6 },
  { number: 42, name: "Ash-Shura", nameAr: "الشورى", ayahCount: 53, pages: 6 },
  { number: 43, name: "Az-Zukhruf", nameAr: "الزخرف", ayahCount: 89, pages: 8 },
  { number: 44, name: "Ad-Dukhan", nameAr: "الدخان", ayahCount: 59, pages: 4 },
  { number: 45, name: "Al-Jathiyah", nameAr: "الجاثية", ayahCount: 37, pages: 4 },
  { number: 46, name: "Al-Ahqaf", nameAr: "الأحقاف", ayahCount: 35, pages: 4 },
  { number: 47, name: "Muhammad", nameAr: "محمد", ayahCount: 38, pages: 4 },
  { number: 48, name: "Al-Fath", nameAr: "الفتح", ayahCount: 29, pages: 4 },
  { number: 49, name: "Al-Hujurat", nameAr: "الحجرات", ayahCount: 18, pages: 2 },
  { number: 50, name: "Qaf", nameAr: "ق", ayahCount: 45, pages: 2 },
  { number: 51, name: "Adh-Dhariyat", nameAr: "الذاريات", ayahCount: 60, pages: 2 },
  { number: 52, name: "At-Tur", nameAr: "الطور", ayahCount: 49, pages: 2 },
  { number: 53, name: "An-Najm", nameAr: "النجم", ayahCount: 62, pages: 2 },
  { number: 54, name: "Al-Qamar", nameAr: "القمر", ayahCount: 55, pages: 2 },
  { number: 55, name: "Ar-Rahman", nameAr: "الرحمن", ayahCount: 78, pages: 2 },
  { number: 56, name: "Al-Waqi'ah", nameAr: "الواقعة", ayahCount: 96, pages: 4 },
  { number: 57, name: "Al-Hadid", nameAr: "الحديد", ayahCount: 29, pages: 4 },
  { number: 58, name: "Al-Mujadilah", nameAr: "المجادلة", ayahCount: 22, pages: 4 },
  { number: 59, name: "Al-Hashr", nameAr: "الحشر", ayahCount: 24, pages: 4 },
  { number: 60, name: "Al-Mumtahanah", nameAr: "الممتحنة", ayahCount: 13, pages: 2 },
  { number: 61, name: "As-Saff", nameAr: "الصف", ayahCount: 14, pages: 2 },
  { number: 62, name: "Al-Jumu'ah", nameAr: "الجمعة", ayahCount: 11, pages: 2 },
  { number: 63, name: "Al-Munafiqun", nameAr: "المنافقون", ayahCount: 11, pages: 2 },
  { number: 64, name: "At-Taghabun", nameAr: "التغابن", ayahCount: 18, pages: 2 },
  { number: 65, name: "At-Talaq", nameAr: "الطلاق", ayahCount: 12, pages: 2 },
  { number: 66, name: "At-Tahrim", nameAr: "التحريم", ayahCount: 12, pages: 2 },
  { number: 67, name: "Al-Mulk", nameAr: "الملك", ayahCount: 30, pages: 2 },
  { number: 68, name: "Al-Qalam", nameAr: "القلم", ayahCount: 52, pages: 2 },
  { number: 69, name: "Al-Haqqah", nameAr: "الحاقة", ayahCount: 52, pages: 2 },
  { number: 70, name: "Al-Ma'arij", nameAr: "المعارج", ayahCount: 44, pages: 2 },
  { number: 71, name: "Nuh", nameAr: "نوح", ayahCount: 28, pages: 2 },
  { number: 72, name: "Al-Jinn", nameAr: "الجن", ayahCount: 28, pages: 2 },
  { number: 73, name: "Al-Muzzammil", nameAr: "المزمل", ayahCount: 20, pages: 2 },
  { number: 74, name: "Al-Muddathir", nameAr: "المدثر", ayahCount: 56, pages: 2 },
  { number: 75, name: "Al-Qiyamah", nameAr: "القيامة", ayahCount: 40, pages: 2 },
  { number: 76, name: "Al-Insan", nameAr: "الإنسان", ayahCount: 31, pages: 2 },
  { number: 77, name: "Al-Mursalat", nameAr: "المرسلات", ayahCount: 50, pages: 2 },
  { number: 78, name: "An-Naba", nameAr: "النبأ", ayahCount: 40, pages: 1 },
  { number: 79, name: "An-Nazi'at", nameAr: "النازعات", ayahCount: 46, pages: 1 },
  { number: 80, name: "Abasa", nameAr: "عبس", ayahCount: 42, pages: 1 },
  { number: 81, name: "At-Takwir", nameAr: "التكوير", ayahCount: 29, pages: 1 },
  { number: 82, name: "Al-Infitar", nameAr: "الانفطار", ayahCount: 19, pages: 1 },
  { number: 83, name: "Al-Mutaffifin", nameAr: "المطففين", ayahCount: 36, pages: 1 },
  { number: 84, name: "Al-Inshiqaq", nameAr: "الانشقاق", ayahCount: 25, pages: 1 },
  { number: 85, name: "Al-Buruj", nameAr: "البروج", ayahCount: 22, pages: 1 },
  { number: 86, name: "At-Tariq", nameAr: "الطارق", ayahCount: 17, pages: 1 },
  { number: 87, name: "Al-A'la", nameAr: "الأعلى", ayahCount: 19, pages: 1 },
  { number: 88, name: "Al-Ghashiyah", nameAr: "الغاشية", ayahCount: 26, pages: 1 },
  { number: 89, name: "Al-Fajr", nameAr: "الفجر", ayahCount: 30, pages: 1 },
  { number: 90, name: "Al-Balad", nameAr: "البلد", ayahCount: 20, pages: 1 },
  { number: 91, name: "Ash-Shams", nameAr: "الشمس", ayahCount: 15, pages: 1 },
  { number: 92, name: "Al-Layl", nameAr: "الليل", ayahCount: 21, pages: 1 },
  { number: 93, name: "Ad-Duha", nameAr: "الضحى", ayahCount: 11, pages: 1 },
  { number: 94, name: "Ash-Sharh", nameAr: "الشرح", ayahCount: 8, pages: 1 },
  { number: 95, name: "At-Tin", nameAr: "التين", ayahCount: 8, pages: 1 },
  { number: 96, name: "Al-Alaq", nameAr: "العلق", ayahCount: 19, pages: 1 },
  { number: 97, name: "Al-Qadr", nameAr: "القدر", ayahCount: 5, pages: 1 },
  { number: 98, name: "Al-Bayyinah", nameAr: "البينة", ayahCount: 8, pages: 1 },
  { number: 99, name: "Az-Zalzalah", nameAr: "الزلزلة", ayahCount: 8, pages: 1 },
  { number: 100, name: "Al-Adiyat", nameAr: "العاديات", ayahCount: 11, pages: 1 },
  { number: 101, name: "Al-Qari'ah", nameAr: "القارعة", ayahCount: 11, pages: 1 },
  { number: 102, name: "At-Takathur", nameAr: "التكاثر", ayahCount: 8, pages: 1 },
  { number: 103, name: "Al-Asr", nameAr: "العصر", ayahCount: 3, pages: 1 },
  { number: 104, name: "Al-Humazah", nameAr: "الهمزة", ayahCount: 9, pages: 1 },
  { number: 105, name: "Al-Fil", nameAr: "الفيل", ayahCount: 5, pages: 1 },
  { number: 106, name: "Quraysh", nameAr: "قريش", ayahCount: 4, pages: 1 },
  { number: 107, name: "Al-Ma'un", nameAr: "الماعون", ayahCount: 7, pages: 1 },
  { number: 108, name: "Al-Kawthar", nameAr: "الكوثر", ayahCount: 3, pages: 1 },
  { number: 109, name: "Al-Kafirun", nameAr: "الكافرون", ayahCount: 6, pages: 1 },
  { number: 110, name: "An-Nasr", nameAr: "النصر", ayahCount: 3, pages: 1 },
  { number: 111, name: "Al-Masad", nameAr: "المسد", ayahCount: 5, pages: 1 },
  { number: 112, name: "Al-Ikhlas", nameAr: "الإخلاص", ayahCount: 4, pages: 1 },
  { number: 113, name: "Al-Falaq", nameAr: "الفلق", ayahCount: 5, pages: 1 },
  { number: 114, name: "An-Nas", nameAr: "الناس", ayahCount: 6, pages: 1 },
];

export function getSurahByNumber(num: number): Surah | undefined {
  return surahs.find((s) => s.number === num);
}

// Juz Amma surahs (78-114)
export const juzAmmaSurahs = surahs.filter((s) => s.number >= 78);

// Challenge milestone surahs
export const challengeSurahNumbers = [2, 3, 67, 18, 36];

export const levelTitles: Record<number, string> = {
  1: "مبتدئ",
  5: "طالب",
  10: "مجتهد",
  20: "حافظ متدرب",
  35: "حافظ",
  50: "متقن",
};

export function getLevelTitle(level: number): string {
  const thresholds = Object.keys(levelTitles)
    .map(Number)
    .sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (level >= threshold) return levelTitles[threshold];
  }
  return "مبتدئ";
}

export function calculateXP(pagesLogged: number, surahNumber: number): number {
  let xp = Math.floor(pagesLogged * 20); // 10 XP per half page = 20 per page
  // Bonus for difficult/long surahs
  if ([2, 3].includes(surahNumber)) xp = Math.floor(xp * 1.5);
  return xp;
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}
