import { useState, useCallback } from 'react';

const STORAGE_KEY_RECENT = 'weather-app-recent';
const STORAGE_KEY_HISTORY = 'weather-app-history';
const MAX_RECENT = 5;
const MAX_HISTORY = 30;

function loadJson(key, defaultValue = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('useSearchHistory: no se pudo guardar en localStorage', e);
  }
}

function uniqueByPlace(items, max) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.name}|${item.country}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, max);
}

/**
 * Hook para recientes e historial de búsqueda (localStorage).
 * - recientes: últimas MAX_RECENT búsquedas seleccionadas
 * - history: últimas MAX_HISTORY búsquedas
 * Cada ítem es { name, country, lat?, lon? }.
 */
export function useSearchHistory() {
  const [recent, setRecent] = useState(() => loadJson(STORAGE_KEY_RECENT, []));
  const [history, setHistory] = useState(() => loadJson(STORAGE_KEY_HISTORY, []));

  const addToRecent = useCallback((item) => {
    if (!item || !item.name) return;
    const entry = {
      name: item.name,
      country: item.country || '',
      lat: item.lat,
      lon: item.lon,
    };
    setRecent((prev) => {
      const next = [entry, ...prev.filter((p) => !(p.name === entry.name && p.country === entry.country))];
      const trimmed = uniqueByPlace(next, MAX_RECENT);
      saveJson(STORAGE_KEY_RECENT, trimmed);
      return trimmed;
    });
    setHistory((prev) => {
      const next = [entry, ...prev.filter((p) => !(p.name === entry.name && p.country === entry.country))];
      const trimmed = uniqueByPlace(next, MAX_HISTORY);
      saveJson(STORAGE_KEY_HISTORY, trimmed);
      return trimmed;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecent([]);
    setHistory([]);
    saveJson(STORAGE_KEY_RECENT, []);
    saveJson(STORAGE_KEY_HISTORY, []);
  }, []);

  return { recent, history, addToRecent, clearHistory };
}
