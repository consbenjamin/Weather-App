import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Search from '../assets/search.svg';

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  }),
};

const emptyVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Cards({ cities, onClose }) {
  return (
    <>
      {cities.length > 0 ? (
        <motion.div
          key="cards-grid"
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full px-3 py-5 sm:px-4 sm:py-6 md:py-8 flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {cities.map((c, index) => (
              <Card
                key={c.id}
                id={c.id}
                index={index}
                temp={c.temp}
                max={c.max}
                min={c.min}
                name={c.name}
                country={c.country}
                img={c.icon}
                description={c.description}
                humidity={c.humidity}
                wind={c.wind}
                pressure={c.pressure}
                forecast={c.forecast}
                onClose={onClose}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          key="empty-state"
          variants={emptyVariants}
          initial="hidden"
          animate="visible"
          className="w-full min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center px-3 sm:px-4 py-8 sm:py-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="max-w-[200px] sm:max-w-[240px] md:max-w-[280px] mb-4 sm:mb-6"
          >
            <img src={Search} alt="" className="w-full h-auto" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-300 text-center mb-2 px-2">
            Busca una ciudad
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-sm text-sm sm:text-base px-2">
            Escribe en la barra de búsqueda, usa las sugerencias o elige una búsqueda reciente.
          </p>
        </motion.div>
      )}
    </>
  );
}
