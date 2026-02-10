/**
 * Servicio para consumir la API de OpenWeather
 * - Current Weather: https://openweathermap.org/current
 * - Geocoding: https://openweathermap.org/api/geocoding-api
 */

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

const DAY_NAMES_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const API_KEY_STORAGE = 'weather-app-api-key';

function getStoredApiKey() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

function getApiKey() {
  const apiKey = getStoredApiKey() || process.env.REACT_APP_OPENWEATHER_API_KEY || '';
  if (!apiKey) {
    throw new Error(
      'API key no configurada. Ve a Configuración (icono de engranaje) y añade tu clave de OpenWeather, o configura REACT_APP_OPENWEATHER_API_KEY en .env'
    );
  }
  return apiKey;
}

/**
 * Obtiene el clima actual de una ciudad por nombre.
 * @param {string} cityName - Nombre de la ciudad (se codifica para URL)
 * @returns {Promise<Object>} Datos normalizados del clima
 * @throws {Error} Con mensaje amigable según el tipo de error
 */
/**
 * Búsqueda predictiva: sugiere lugares por nombre (Geocoding API).
 * @param {string} query - Texto a buscar
 * @param {number} limit - Máximo de resultados (1-5)
 * @returns {Promise<Array<{ name, country, lat, lon, state? }>>}
 */
export async function getCitySuggestions(query, limit = 5) {
  const apiKey = getApiKey();
  const q = encodeURIComponent((query || '').trim());
  if (!q) return [];

  const url = `${GEO_URL}?q=${q}&limit=${Math.min(5, Math.max(1, limit))}&appid=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) return [];

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    name: item.name,
    country: item.country || '',
    state: item.state || '',
    lat: item.lat,
    lon: item.lon,
  }));
}

/**
 * Obtiene el clima actual por coordenadas (más preciso que por nombre).
 */
export async function getWeatherByCoords(lat, lon) {
  const apiKey = getApiKey();
  const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Ubicación no encontrada.');
    if (response.status === 401) throw new Error('API key inválida.');
    if (response.status === 429) throw new Error('Demasiadas peticiones. Espera un momento.');
    throw new Error(`Error del servidor (${response.status})`);
  }
  const data = await response.json();
  return normalizeWeatherData(data);
}

export async function getWeatherByCity(cityName) {
  const apiKey = getApiKey();
  const query = encodeURIComponent((cityName || '').trim());
  if (!query) {
    throw new Error('Escribe el nombre de una ciudad');
  }

  const url = `${WEATHER_URL}?q=${query}&units=metric&lang=es&appid=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Ciudad no encontrada. Verifica el nombre e intenta de nuevo.');
    }
    if (response.status === 401) {
      throw new Error('API key inválida. Revisa tu configuración.');
    }
    if (response.status === 429) {
      throw new Error('Demasiadas peticiones. Espera un momento antes de buscar de nuevo.');
    }
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Error del servidor (${response.status})`);
  }

  const data = await response.json();
  return normalizeWeatherData(data);
}

/**
 * Normaliza la respuesta de OpenWeather al formato usado por la app.
 */
function normalizeWeatherData(data) {
  return {
    id: data.id,
    name: data.name,
    country: data.sys?.country || '',
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    min: Math.round(data.main.temp_min),
    max: Math.round(data.main.temp_max),
    humidity: data.main.humidity ?? 0,
    pressure: data.main.pressure ?? 0,
    description: data.weather?.[0]?.description ?? '',
    weather: data.weather?.[0]?.main ?? '',
    icon: data.weather?.[0]?.icon ?? '01d',
    wind: data.wind?.speed ?? 0,
    clouds: data.clouds?.all ?? 0,
    latitud: data.coord?.lat,
    longitud: data.coord?.lon,
  };
}

/**
 * Pronóstico a 5 días por coordenadas (agrupado por día).
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Array<{ date, dayName, min, max, icon, description }>>}
 */
export async function getForecast5Days(lat, lon) {
  const apiKey = getApiKey();
  const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) return [];

  const data = await response.json();
  if (!Array.isArray(data.list)) return [];

  const byDay = new Map();
  for (const item of data.list) {
    const dt = new Date(item.dt * 1000);
    const dateKey = dt.toISOString().slice(0, 10);
    if (!byDay.has(dateKey)) {
      byDay.set(dateKey, {
        date: dateKey,
        dayName: DAY_NAMES_ES[dt.getDay()],
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather?.[0]?.icon ?? '01d',
        description: item.weather?.[0]?.description ?? '',
        items: [],
      });
    }
    const day = byDay.get(dateKey);
    day.items.push(item);
    day.min = Math.min(day.min, item.main.temp_min);
    day.max = Math.max(day.max, item.main.temp_max);
  }

  const sorted = Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
  return sorted.slice(0, 5).map((d) => ({
    date: d.date,
    dayName: d.dayName,
    min: Math.round(d.min),
    max: Math.round(d.max),
    icon: d.items[Math.min(Math.floor(d.items.length / 2), d.items.length - 1)].weather?.[0]?.icon ?? d.icon,
    description: d.items[0]?.weather?.[0]?.description ?? d.description,
  }));
}

/**
 * URL del icono de OpenWeather (HTTPS).
 */
export function getWeatherIconUrl(iconCode, size = '2x') {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}
