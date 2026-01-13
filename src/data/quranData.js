// src/data/quranData.js
// Version adaptée pour la nouvelle structure JSON Qaloon

import qaloonQuran from './qaloonQuran.json'; // ← ton fichier JSON téléchargé

// Fonction pour regrouper les ayahs par sourate
const groupBySurah = (ayahs) => {
  const surahs = {};
  
  ayahs.forEach(ayah => {
    const surahNum = ayah.sura_no;
    
    if (!surahs[surahNum]) {
      surahs[surahNum] = {
        number: surahNum,
        name: ayah.sura_name_ar,
        nameEn: ayah.sura_name_en,
        verses: [],
        firstPage: ayah.page,
        firstJuz: ayah.jozz,
      };
    }
    
    surahs[surahNum].verses.push({
      number: ayah.aya_no,
      text: ayah.aya_text,
      page: ayah.page,
      juz: ayah.jozz,
      lineStart: ayah.line_start,
      lineEnd: ayah.line_end,
    });
  });
  
  return Object.values(surahs);
};

// Fonction pour regrouper les ayahs par page
const groupByPage = (ayahs) => {
  const pages = {};
  
  ayahs.forEach(ayah => {
    const pageNum = parseInt(ayah.page);
    
    if (!pages[pageNum]) {
      pages[pageNum] = [];
    }
    
    pages[pageNum].push({
      surahNumber: ayah.sura_no,
      surahName: ayah.sura_name_ar,
      verseNumber: ayah.aya_no,
      text: ayah.aya_text,
      juz: ayah.jozz,
      lineStart: ayah.line_start,
      lineEnd: ayah.line_end,
    });
  });
  
  return pages;
};

// Traiter les données
const surahsData = groupBySurah(qaloonQuran);
const pagesData = groupByPage(qaloonQuran);

// Déterminer le type de révélation (Meccan/Medinan) basé sur le numéro de sourate
const getRevelationType = (surahNumber) => {
  // Les sourates médinoises connues
  const medinanSurahs = [2, 3, 4, 5, 8, 9, 22, 24, 33, 47, 48, 49, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 110];
  return medinanSurahs.includes(surahNumber) ? 'Medinan' : 'Meccan';
};

export const quranData = {
  // Liste des sourates avec leurs informations
  surahs: surahsData.map(surah => ({
    number: surah.number,
    name: surah.name,
    nameEn: surah.nameEn,
    verses: surah.verses.length,
    page: parseInt(surah.firstPage),
    juz: surah.firstJuz,
    revelationType: getRevelationType(surah.number),
  })),

  // Tous les versets accessibles par numéro de sourate
  verses: surahsData.reduce((acc, surah) => {
    acc[surah.number] = surah.verses.map(v => v.text);
    return acc;
  }, {}),

  // Versets détaillés par sourate (avec métadonnées)
  versesDetailed: surahsData.reduce((acc, surah) => {
    acc[surah.number] = surah.verses;
    return acc;
  }, {}),

  // Versets par page
  pageVerses: pagesData,

  // Versets échantillons pour les tests (utilise tous les versets maintenant)
  sampleVerses: surahsData.reduce((acc, surah) => {
    acc[surah.number] = surah.verses.map(v => v.text);
    return acc;
  }, {}),

  // Helpers utiles
  getSurahName: (number) => {
    const surah = suranData.surahs.find(s => s.number === number);
    return surah ? surah.name : 'سورة غير معروفة';
  },

  getSurahVersesCount: (number) => {
    const surah = quranData.surahs.find(s => s.number === number);
    return surah ? surah.verses : 0;
  },

  getVersesByPage: (pageNumber) => {
    return pagesData[pageNumber] || [];
  },

  getVerseText: (surahNumber, verseNumber) => {
    const verses = quranData.versesDetailed[surahNumber];
    if (!verses) return null;
    const verse = verses.find(v => v.number === verseNumber);
    return verse ? verse.text : null;
  },

  getSurahsByPageRange: (pageFrom, pageTo) => {
    const surahsInRange = new Set();
    
    for (let page = pageFrom; page <= pageTo; page++) {
      const verses = pagesData[page];
      if (verses) {
        verses.forEach(v => surahsInRange.add(v.surahNumber));
      }
    }
    
    return Array.from(surahsInRange).sort((a, b) => a - b);
  },

  getRandomVerseFromPage: (pageNumber) => {
    const verses = pagesData[pageNumber];
    if (!verses || verses.length === 0) return null;
    // Utilise crypto pour plus de randomness
    const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
      ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
      : Math.random();
    const randomIndex = Math.floor(randomValue * verses.length);
    return verses[randomIndex];
  },

  getRandomVerseFromSurah: (surahNumber) => {
    const verses = quranData.versesDetailed[surahNumber];
    if (!verses || verses.length === 0) return null;
    // Utilise crypto pour plus de randomness
    const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
      ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
      : Math.random();
    const randomIndex = Math.floor(randomValue * verses.length);
    return verses[randomIndex];
  },

  getRandomVerseFromPageRange: (pageFrom, pageTo) => {
    // Collect ALL verses from ALL pages in range first
    const allVerses = [];
    for (let page = pageFrom; page <= pageTo; page++) {
      const versesInPage = pagesData[page];
      if (versesInPage && versesInPage.length > 0) {
        allVerses.push(...versesInPage);
      }
    }
    
    if (allVerses.length === 0) return null;
    
    // Shuffle using Fisher-Yates algorithm for better randomness
    const shuffled = [...allVerses];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
        ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
        : Math.random();
      const j = Math.floor(randomValue * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return a random verse from shuffled array
    const finalRandomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
      ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
      : Math.random();
    return shuffled[Math.floor(finalRandomValue * shuffled.length)];
  },
};

export default quranData;