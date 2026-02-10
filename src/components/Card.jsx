import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiOutlineCalendar, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';
import { BsSpeedometer2 } from 'react-icons/bs';
import { getWeatherIconUrl } from '../services/weatherApi';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
};

export default function Card({
  temp,
  min,
  max,
  name,
  country,
  img,
  description,
  humidity,
  wind,
  pressure,
  forecast = [],
  onClose,
  id,
  index = 0,
}) {
  const [showForecast, setShowForecast] = useState(false);
  const hasForecast = Array.isArray(forecast) && forecast.length > 0;

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      className="group relative w-full max-w-[320px] rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-xl border border-slate-200/80 dark:border-slate-600/80 overflow-hidden hover:shadow-2xl hover:border-sky-200 dark:hover:border-sky-600/50"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <button
        type="button"
        onClick={() => onClose(id)}
        className="absolute top-3 right-3 z-10 p-1 rounded-full text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        aria-label="Eliminar ciudad"
      >
        <AiFillCloseCircle className="text-2xl" />
      </button>

      <div className="p-6 pt-8">
        <div className="flex items-center justify-center mb-4">
          <img
            src={getWeatherIconUrl(img)}
            width={96}
            height={96}
            alt={description || 'Estado del tiempo'}
            className="drop-shadow-md"
          />
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-0.5">
          {name}
          {country && (
            <span className="text-slate-500 dark:text-slate-400 font-normal text-sm ml-1">({country})</span>
          )}
        </h2>
        {description && (
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center capitalize mb-4">{description}</p>
        )}

        <div className="flex items-baseline justify-center gap-2 mb-5">
          <span className="text-5xl font-extralight text-slate-800 dark:text-slate-100 tabular-nums">{temp}</span>
          <span className="text-2xl text-slate-500 dark:text-slate-400 font-light">°C</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-5">
          Min <span className="font-medium text-slate-700 dark:text-slate-300">{min}°</span>
          <span className="mx-2 text-slate-400 dark:text-slate-500">/</span>
          Max <span className="font-medium text-slate-700 dark:text-slate-300">{max}°</span>
        </p>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-600">
          <div className="flex flex-col items-center gap-1">
            <WiHumidity className="text-2xl text-sky-600 dark:text-sky-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Humedad</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{humidity}%</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <WiStrongWind className="text-2xl text-sky-600 dark:text-sky-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Viento</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{wind} m/s</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <BsSpeedometer2 className="text-2xl text-sky-600 dark:text-sky-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Presión</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{pressure} hPa</span>
          </div>
        </div>

        {hasForecast && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-600">
            <button
              type="button"
              onClick={() => setShowForecast((v) => !v)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-inset"
              aria-expanded={showForecast}
            >
              <HiOutlineCalendar className="text-lg" />
              <span className="text-sm font-medium">
                {showForecast ? 'Ocultar pronóstico' : 'Ver pronóstico 5 días'}
              </span>
              {showForecast ? (
                <HiOutlineChevronUp className="text-lg" />
              ) : (
                <HiOutlineChevronDown className="text-lg" />
              )}
            </button>
            <AnimatePresence>
              {showForecast && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-3 mb-2">
                    Próximos 5 días
                  </p>
                  <div className="flex justify-between gap-1 overflow-x-auto pb-1">
                    {forecast.map((day) => (
                      <div
                        key={day.date}
                        className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[52px] py-2 px-1 rounded-lg bg-slate-100/80 dark:bg-slate-700/50"
                      >
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{day.dayName}</span>
                        <img
                          src={getWeatherIconUrl(day.icon, '2x')}
                          width={32}
                          height={32}
                          alt={day.description || ''}
                          className="opacity-90"
                        />
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                          {day.min}° / {day.max}°
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.article>
  );
}
