import React from 'react';
import { AiFillHeart } from 'react-icons/ai';

function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 py-3 px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200/80 dark:border-slate-700/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
      <p className="flex items-center justify-center sm:justify-start text-slate-600 dark:text-slate-400 text-sm">
        Hecho con
        <AiFillHeart className="mx-1 text-red-500 inline" />
        por
        <a
          href="https://www.linkedin.com/in/constantinoabba/"
          target="_blank"
          rel="noreferrer"
          className="ml-1 font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 underline underline-offset-2"
        >
          Constantino Abba
        </a>
      </p>
    </footer>
  );
}

export default Footer;
