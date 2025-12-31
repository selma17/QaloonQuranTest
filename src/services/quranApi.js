// src/services/quranApi.js
// Service pour l'intégration de l'API du Coran

import axios from 'axios';

// URL de base de l'API
const API_BASE_URL = 'https://api.alquran.cloud/v1';

// Edition pour la riwayah de Qalun
// Note: L'API peut ne pas avoir spécifiquement Qalun, nous utiliserons Uthmani
const EDITION = 'quran-uthmani';

/**
 * Récupérer la liste de toutes les sourates
 * @returns {Promise<Array>} Liste des sourates
 */
export const getAllSurahs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/surah`);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des sourates:', error);
    throw error;
  }
};

/**
 * Récupérer une sourate spécifique avec tous ses versets
 * @param {number} surahNumber - Numéro de la sourate (1-114)
 * @returns {Promise<Object>} Sourate avec ses versets
 */
export const getSurah = async (surahNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/surah/${surahNumber}/${EDITION}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la sourate ${surahNumber}:`, error);
    throw error;
  }
};

/**
 * Récupérer un verset spécifique
 * @param {number} surahNumber - Numéro de la sourate
 * @param {number} verseNumber - Numéro du verset
 * @returns {Promise<Object>} Verset
 */
export const getVerse = async (surahNumber, verseNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ayah/${surahNumber}:${verseNumber}/${EDITION}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du verset ${surahNumber}:${verseNumber}:`, error);
    throw error;
  }
};

/**
 * Récupérer une page spécifique du Coran (Mushaf)
 * @param {number} pageNumber - Numéro de la page (1-604)
 * @returns {Promise<Object>} Page avec ses versets
 */
export const getPage = async (pageNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/page/${pageNumber}/${EDITION}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la page ${pageNumber}:`, error);
    throw error;
  }
};

/**
 * Récupérer plusieurs pages du Coran
 * @param {number} startPage - Page de début
 * @param {number} endPage - Page de fin
 * @returns {Promise<Array>} Tableau de pages
 */
export const getPages = async (startPage, endPage) => {
  try {
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      const page = await getPage(i);
      pages.push(page);
    }
    return pages;
  } catch (error) {
    console.error(`Erreur lors de la récupération des pages ${startPage}-${endPage}:`, error);
    throw error;
  }
};

/**
 * Récupérer un verset aléatoire d'une sourate
 * @param {number} surahNumber - Numéro de la sourate
 * @returns {Promise<Object>} Verset aléatoire
 */
export const getRandomVerseFromSurah = async (surahNumber) => {
  try {
    const surah = await getSurah(surahNumber);
    const randomIndex = Math.floor(Math.random() * surah.ayahs.length);
    return surah.ayahs[randomIndex];
  } catch (error) {
    console.error(`Erreur lors de la récupération d'un verset aléatoire de la sourate ${surahNumber}:`, error);
    throw error;
  }
};

/**
 * Récupérer un verset aléatoire d'une plage de pages
 * @param {number} startPage - Page de début
 * @param {number} endPage - Page de fin
 * @returns {Promise<Object>} Verset aléatoire
 */
export const getRandomVerseFromPages = async (startPage, endPage) => {
  try {
    // Choisir une page aléatoire dans la plage
    const randomPage = Math.floor(Math.random() * (endPage - startPage + 1)) + startPage;
    const page = await getPage(randomPage);
    
    // Choisir un verset aléatoire de cette page
    const randomIndex = Math.floor(Math.random() * page.ayahs.length);
    return page.ayahs[randomIndex];
  } catch (error) {
    console.error(`Erreur lors de la récupération d'un verset aléatoire des pages ${startPage}-${endPage}:`, error);
    throw error;
  }
};

/**
 * Obtenir des informations sur une sourate
 * @param {number} surahNumber - Numéro de la sourate
 * @returns {Promise<Object>} Informations de la sourate
 */
export const getSurahInfo = async (surahNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/surah/${surahNumber}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des infos de la sourate ${surahNumber}:`, error);
    throw error;
  }
};

// API Alternative : Quran.com API (au cas où)
const QURAN_COM_BASE_URL = 'https://api.quran.com/api/v4';

/**
 * Alternative: Récupérer les sourates depuis Quran.com API
 * @returns {Promise<Array>} Liste des sourates
 */
export const getChaptersFromQuranCom = async () => {
  try {
    const response = await axios.get(`${QURAN_COM_BASE_URL}/chapters`);
    return response.data.chapters;
  } catch (error) {
    console.error('Erreur lors de la récupération des sourates (Quran.com):', error);
    throw error;
  }
};

/**
 * Alternative: Récupérer les versets d'une sourate depuis Quran.com API
 * @param {number} chapterId - ID de la sourate
 * @returns {Promise<Array>} Versets
 */
export const getVersesFromQuranCom = async (chapterId) => {
  try {
    const response = await axios.get(`${QURAN_COM_BASE_URL}/verses/by_chapter/${chapterId}`, {
      params: {
        words: false,
        translations: 167, // French translation
        fields: 'text_uthmani',
        per_page: 300,
      },
    });
    return response.data.verses;
  } catch (error) {
    console.error(`Erreur lors de la récupération des versets (Quran.com):`, error);
    throw error;
  }
};

export default {
  getAllSurahs,
  getSurah,
  getVerse,
  getPage,
  getPages,
  getRandomVerseFromSurah,
  getRandomVerseFromPages,
  getSurahInfo,
  getChaptersFromQuranCom,
  getVersesFromQuranCom,
};