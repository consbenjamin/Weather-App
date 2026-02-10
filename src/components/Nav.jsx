import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TiWeatherCloudy } from 'react-icons/ti';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import SearchBar from './SearchBar';
import Settings, { SettingsIcon } from './Settings';
import { useTheme } from '../context/ThemeContext';

function Nav({ onSearch, loading }) {
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-20 w-full max-w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-x-hidden"
    >
      <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        {/* Contenedor flex: en móvil columna, en sm+ fila */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Fila 1 móvil / Bloque izquierdo desktop: logo + botones */}
          <div className="flex items-center justify-between gap-2 min-w-0 flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 text-sky-800 dark:text-sky-300 hover:text-sky-600 dark:hover:text-sky-200 transition-colors min-w-0 flex-shrink"
              aria-label="Weather App - Inicio"
            >
              <TiWeatherCloudy className="text-2xl sm:text-3xl flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9" />
              <span className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm sm:text-xl max-w-[160px] sm:max-w-none">
                Weather App
              </span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors touch-manipulation h-10 w-10 flex items-center justify-center sm:h-9 sm:w-9"
                aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {theme === 'dark' ? (
                  <HiOutlineSun className="text-xl sm:text-lg" />
                ) : (
                  <HiOutlineMoon className="text-xl sm:text-lg" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors touch-manipulation h-10 w-10 flex items-center justify-center sm:h-9 sm:w-9"
                aria-label="Configuración"
              >
                <SettingsIcon className="text-xl sm:text-lg" />
              </button>
            </div>
          </div>

          {/* Fila 2 móvil / Bloque derecho desktop: búsqueda */}
          <div className="w-full min-w-0 sm:flex-1 sm:max-w-md lg:max-w-lg">
            <SearchBar onSearch={onSearch} loading={loading} />
          </div>
        </div>
      </div>
      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </motion.nav>
  );
}

export default Nav;
