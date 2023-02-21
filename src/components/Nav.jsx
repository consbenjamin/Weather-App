import React from 'react';
import SearchBar from './SearchBar.jsx';
import { TiWeatherCloudy } from "react-icons/ti";

import { Link } from 'react-router-dom';

function Nav({onSearch}) {
  return (
    <nav className="bg-white border-gray-200 rounded px-2 sticky w-full top-0 py-2.5 shadow-lg items-center md:px-12 md:justify-between">
      <div className='container flex flex-wrap items-center justify-between mx-auto'>
        <Link to='/' className='flex items-center'>
          <TiWeatherCloudy className="mr-4 text-3xl text-sky-900"/>
          <h3 className='hidden md:block font-bold text-xl'>Weather App </h3>
        </Link>
        <SearchBar onSearch={onSearch}/>
      </div>
    </nav>
  );
};

export default Nav;
