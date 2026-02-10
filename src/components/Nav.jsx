import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TiWeatherCloudy } from 'react-icons/ti';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import SearchBar from './SearchBar';
import { useTheme } from '../context/ThemeContext';

function Nav({ onSearch, loading }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-20 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm"
    >
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-sky-800 dark:text-sky-300 hover:text-sky-600 dark:hover:text-sky-200 transition-colors"
            >
              <TiWeatherCloudy className="text-3xl flex-shrink-0" />
              <span className="font-bold text-xl text-slate-800 dark:text-slate-100">Weather App</span>
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors"
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? (
                <HiOutlineSun className="text-xl" />
              ) : (
                <HiOutlineMoon className="text-xl" />
              )}
            </button>
          </div>
          <SearchBar onSearch={onSearch} loading={loading} />
        </div>
      </div>
    </motion.nav>
  );
}

export default Nav;
