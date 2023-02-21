import React, { useState } from "react";

export default function SearchBar({onSearch}) {
  const [city, setCity] = useState("");
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSearch(city);
    }}>
      <input
        type="text"
        placeholder="🔎City..."
        value={city}
        onChange={e => setCity(e.target.value)}
        className='py-2 px-4 outline-none no-underline bg-gray-200 rounded-md font-sans font-semibold text-sky-900 focus:placeholder:invisible'
      />
    </form>
  );
}
