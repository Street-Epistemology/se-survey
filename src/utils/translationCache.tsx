// Translations cache helper
import { LanguageTranslations, Translations } from '../DataTypes';
import * as db from '../firebase';

// Cache keys
const TRANSLATIONS_CACHE_KEY = 'se-survey-translations';
const TRANSLATIONS_TIMESTAMP_KEY = 'se-survey-translations-timestamp';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Load translations from cache if available
 * @param lang Language code
 * @returns Cached translations or undefined if not cached
 */
export const getTranslationsFromCache = (
  lang: string,
): LanguageTranslations | undefined => {
  try {
    const cache = localStorage.getItem(TRANSLATIONS_CACHE_KEY);
    if (!cache) return undefined;

    const parsedCache = JSON.parse(cache);
    if (!parsedCache[lang]) return undefined;

    // Check timestamp
    const timestamp = localStorage.getItem(TRANSLATIONS_TIMESTAMP_KEY);
    if (!timestamp) return undefined;

    const parsedTimestamp = JSON.parse(timestamp);
    if (!parsedTimestamp[lang]) return undefined;

    // Check if cache is still valid
    const now = Date.now();
    if (now - parsedTimestamp[lang] > CACHE_TTL) return undefined;

    return parsedCache[lang];
  } catch (error) {
    console.error('Error loading translations from cache:', error);
    return undefined;
  }
};

/**
 * Save translations to cache
 * @param lang Language code
 * @param translations Translations object
 */
export const saveTranslationsToCache = (
  lang: string,
  translations: LanguageTranslations,
): void => {
  try {
    // Get current cache
    const currentCache = localStorage.getItem(TRANSLATIONS_CACHE_KEY);
    const parsedCache = currentCache ? JSON.parse(currentCache) : {};

    // Get current timestamps
    const currentTimestamp = localStorage.getItem(TRANSLATIONS_TIMESTAMP_KEY);
    const parsedTimestamp = currentTimestamp
      ? JSON.parse(currentTimestamp)
      : {};

    // Update cache
    parsedCache[lang] = translations;
    parsedTimestamp[lang] = Date.now();

    // Save to localStorage
    localStorage.setItem(TRANSLATIONS_CACHE_KEY, JSON.stringify(parsedCache));
    localStorage.setItem(
      TRANSLATIONS_TIMESTAMP_KEY,
      JSON.stringify(parsedTimestamp),
    );
  } catch (error) {
    console.error('Error saving translations to cache:', error);
  }
};

/**
 * Get translations with cache support
 * @param path Firebase path for translations
 * @param setTranslations State setter function
 * @param lang Language code
 * @returns Cleanup function for useEffect
 */
export const getTranslationsWithCache = (
  lang: string,
  setTranslations: (translations: LanguageTranslations) => void,
): (() => void) => {
  // First try to load from cache
  const cachedTranslations = getTranslationsFromCache(lang);
  if (cachedTranslations) {
    setTranslations(cachedTranslations);
  }

  // Then fetch from Firebase to get the latest
  const path = `/translations/${lang}`;
  const cleanup = db.getOnOff(path, (newTranslations: LanguageTranslations) => {
    // Save the new translations to cache
    saveTranslationsToCache(lang, newTranslations);
    // Update the UI with the new translations
    setTranslations(newTranslations);
  });

  return cleanup;
};

/**
 * Get all translations with cache support
 * @param setTranslations State setter function
 * @returns Cleanup function for useEffect
 */
export const getAllTranslationsWithCache = (
  setTranslations: (translations: Translations) => void,
): (() => void) => {
  // Try to load from cache first (if needed)
  // For this case, we'll just get from Firebase directly
  return db.getOnOff('/translations/', (newTranslations: Translations) => {
    // Save each language to the cache
    if (newTranslations) {
      Object.keys(newTranslations).forEach((lang) => {
        saveTranslationsToCache(lang, newTranslations[lang]);
      });
    }

    // Update the UI with the new translations
    setTranslations(newTranslations);
  });
};
