import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Swal from 'sweetalert2';

import Nav from './components/Nav';
import Cards from './components/Cards';
import Footer from './components/Footer';
import { useSearchHistory } from './hooks/useSearchHistory';
import { getWeatherByCity, getWeatherByCoords, getForecast5Days } from './services/weatherApi';

function App() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToRecent } = useSearchHistory();

  function onClose(id) {
    setCities((old) => old.filter((c) => c.id !== id));
  }

  async function onSearch(selected) {
    const isPlace = selected && typeof selected === 'object' && selected.name;
    const term = isPlace ? selected.name.trim() : (typeof selected === 'string' ? selected : '').trim();

    if (!term) {
      Swal.fire({
        title: 'Campo vacío',
        text: 'Escribe el nombre de una ciudad o elige una sugerencia.',
        icon: 'info',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    setLoading(true);
    try {
      const city = isPlace && selected.lat != null && selected.lon != null
        ? await getWeatherByCoords(selected.lat, selected.lon)
        : await getWeatherByCity(term);

      if (cities.some((c) => c.id === city.id)) {
        Swal.fire({
          title: 'Ya añadida',
          text: 'Esa ciudad ya está en la lista.',
          icon: 'warning',
          confirmButtonText: 'Ok',
        });
        return;
      }

      let forecast = [];
      if (city.latitud != null && city.longitud != null) {
        try {
          forecast = await getForecast5Days(city.latitud, city.longitud);
        } catch {
          forecast = [];
        }
      }
      setCities((old) => [...old, { ...city, forecast }]);
      addToRecent({ name: city.name, country: city.country, lat: city.latitud, lon: city.longitud });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo obtener el clima. Intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav onSearch={onSearch} loading={loading} />
      <main className="min-h-[calc(100vh-10rem)] sm:min-h-[calc(100vh-8rem)] pb-20 sm:pb-20 pt-1">
        <Routes>
          <Route path="/" element={<Cards cities={cities} onClose={onClose} />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
