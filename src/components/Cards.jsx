import React from 'react';
import Card from './Card';
import Search from '../assets/search.svg';

export default function Cards({cities, onClose}) {
  return (<>

  {cities.length > 0 ? (
    <div className='w-full flex flex-wrap justify-center gap-4 max-w-7xl m-auto'>
      {cities.map(c => <Card
          key={c.id}
          temp={c.temp}
          max={c.max}
          min={c.min}
          name={c.name}
          img={c.img}
          onClose={() => onClose(c.id)}
        /> )}
    </div>
  ) : (
    <div className="w-full h-full grid place-items-center mt-48">
          <div className="max-w-sm mx-4">
            <img src={Search} alt="Search for a City!" />
          </div>
          <h1 className="m-0 mt-8 text-2xl">Search for a City!</h1>
        </div>
      )}
  </>);
}
