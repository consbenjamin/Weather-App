import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineClock, HiOutlineTrash } from 'react-icons/hi';
import { getCitySuggestions } from '../services/weatherApi';
import { useSearchHistory } from '../hooks/useSearchHistory';

const DEBOUNCE_MS = 350;

export default function SearchBar({ onSearch, loading = false }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownRect, setDropdownRect] = useState(null);
  const { recent, history, clearHistory } = useSearchHistory();
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  const runSearch = useCallback(
    (value) => {
      if (typeof value === 'string') {
        onSearch(value.trim());
        setQuery('');
        setOpen(false);
        return;
      }
      if (value && value.name) {
        onSearch(value);
        setQuery('');
        setOpen(false);
      }
    },
    [onSearch]
  );

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSuggestionsLoading(true);
      getCitySuggestions(query, 5)
        .then((data) => setSuggestions(Array.isArray(data) ? data : []))
        .catch(() => setSuggestions([]))
        .finally(() => setSuggestionsLoading(false));
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const showRecentOrHistory = open && !query.trim();
  const showSuggestions = open && query.trim().length > 0;
  const hasRecent = recent.length > 0;
  const hasHistory = history.length > 0;
  const showDropdown = open && (showRecentOrHistory ? (hasRecent || hasHistory) : true);

  // Posicionar dropdown debajo del input (para el portal)
  useEffect(() => {
    if (!showDropdown || !wrapperRef.current) return;
    const el = wrapperRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (!showDropdown) setDropdownRect(null);
  }, [showDropdown]);

  useEffect(() => {
    function handleClickOutside(e) {
      const inWrapper = wrapperRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inWrapper && !inDropdown) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownContent =
    showDropdown && dropdownRect ? (
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          top: dropdownRect.top,
          left: dropdownRect.left,
          width: dropdownRect.width,
          zIndex: 200,
        }}
      >
        <motion.div
          id="search-dropdown"
          role="listbox"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 shadow-xl max-h-[min(320px,70vh)] overflow-y-auto overscroll-contain"
        >
            {showSuggestions ? (
              <>
                {suggestionsLoading ? (
                  <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">Buscando...</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No hay sugerencias. Escribe más o busca por nombre.
                  </div>
                ) : (
                  suggestions.map((item, i) => (
                    <motion.button
                      key={`${item.name}-${item.country}-${item.lat}-${item.lon}`}
                      type="button"
                      role="option"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => runSearch(item)}
                      className="w-full px-4 py-3 sm:py-2.5 text-left flex items-center gap-2 hover:bg-sky-50 dark:hover:bg-sky-900/40 focus:bg-sky-50 dark:focus:bg-sky-900/40 focus:outline-none text-slate-800 dark:text-slate-200 min-h-[44px] touch-manipulation"
                    >
                      <HiOutlineSearch className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                      <span className="font-medium truncate">{item.name}</span>
                      {item.state && <span className="text-slate-500 dark:text-slate-400 text-sm">{item.state},</span>}
                      <span className="text-slate-500 dark:text-slate-400 text-sm">{item.country}</span>
                    </motion.button>
                  ))
                )}
              </>
            ) : (
              <>
                {hasRecent && (
                  <div className="px-4 pt-2 pb-1">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
                      <HiOutlineClock className="text-base" />
                      Recientes
                    </div>
                    {recent.slice(0, 5).map((item, i) => (
                      <motion.button
                        key={`recent-${item.name}-${item.country}-${i}`}
                        type="button"
                        role="option"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => runSearch(item)}
                        className="w-full px-4 py-3 sm:py-2.5 text-left flex items-center gap-2 hover:bg-sky-50 dark:hover:bg-sky-900/40 focus:bg-sky-50 dark:focus:bg-sky-900/40 focus:outline-none text-slate-800 dark:text-slate-200 rounded-lg min-h-[44px] touch-manipulation"
                      >
                        <HiOutlineClock className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                        <span className="font-medium truncate">{item.name}</span>
                        {item.country && (
                          <span className="text-slate-500 text-sm">({item.country})</span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
                {hasHistory && (
                  <div className="px-4 pt-2 pb-2 border-t border-slate-100 dark:border-slate-700 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
                        Historial
                      </span>
                      <button
                        type="button"
                        onClick={clearHistory}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900"
                        aria-label="Borrar historial"
                      >
                        <HiOutlineTrash className="text-lg" />
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto mt-1">
                      {history.slice(0, 10).map((item, i) => (
                        <motion.button
                          key={`hist-${item.name}-${item.country}-${i}`}
                          type="button"
                          role="option"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.05 + i * 0.02 }}
                          onClick={() => runSearch(item)}
                          className="w-full px-4 py-2.5 sm:py-2 text-left flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:bg-slate-50 dark:focus:bg-slate-700/50 focus:outline-none text-slate-700 dark:text-slate-300 text-sm rounded-lg min-h-[44px] sm:min-h-0 touch-manipulation"
                        >
                          <span>{item.name}</span>
                          {item.country && (
                            <span className="text-slate-400 dark:text-slate-500 text-xs">({item.country})</span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
                {!hasRecent && !hasHistory && (
                  <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                    Escribe para buscar o verás aquí tus búsquedas recientes.
                  </div>
                )}
              </>
            )}
        </motion.div>
      </div>
    ) : null;

  return (
    <>
      <div ref={wrapperRef} className="relative w-full max-w-md min-w-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) runSearch(query.trim());
          }}
          className="flex flex-row gap-2 min-w-0"
        >
          <div className="relative flex-1 min-w-0">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg sm:text-xl pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar ciudad..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              disabled={loading}
              className="w-full min-w-0 py-2.5 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-60 transition-shadow text-base"
              aria-label="Buscar ciudad"
              aria-autocomplete="list"
              id="search-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-sky-600 dark:bg-sky-500 text-white font-medium hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px] flex-shrink-0"
          >
            {loading ? '...' : 'Buscar'}
          </button>
        </form>
      </div>
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </>
  );
}
