import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCog } from 'react-icons/hi';
import { API_KEY_STORAGE } from '../services/weatherApi';

const OPENWEATHER_API_URL = 'https://openweathermap.org/api';

export default function Settings({ open, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      setApiKey(localStorage.getItem(API_KEY_STORAGE) || '');
      setSaved(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();
    const value = (apiKey || '').trim();
    if (typeof window !== 'undefined') {
      if (value) {
        localStorage.setItem(API_KEY_STORAGE, value);
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          onClose();
        }, 800);
      } else {
        localStorage.removeItem(API_KEY_STORAGE);
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          onClose();
        }, 600);
      }
    }
  }

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-labelledby="settings-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-600 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh] min-h-[280px]"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
          >
            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-200 dark:border-slate-600 flex-shrink-0">
              <h2 id="settings-title" className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                Configuración
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Introduce tu API key de OpenWeather para consultar el clima.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto min-h-0">
              <div>
                <label htmlFor="api-key-input" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  API Key de OpenWeather
                </label>
                <input
                  id="api-key-input"
                  type="password"
                  autoComplete="off"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Pega aquí tu API key"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-base"
                />
                <a
                  href={OPENWEATHER_API_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs sm:text-sm text-sky-600 dark:text-sky-400 hover:underline break-all"
                >
                  Obtener API key en openweathermap.org →
                </a>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors touch-manipulation min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 dark:bg-sky-500 text-white font-medium hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-60 touch-manipulation min-h-[44px]"
                >
                  {saved ? 'Guardado' : 'Guardar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

export { HiOutlineCog as SettingsIcon };
