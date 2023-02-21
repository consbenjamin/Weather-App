import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import Nav from './components/Nav';
import Cards from './components/Cards';
import Footer from './components/Footer';

const apiKey = '8f11e7f9d66a0de7a0e931642eeb8fa4';

function App() {
  const [cities, setCities] = useState([]);

  function onClose(id) {
    setCities(oldCities => oldCities.filter(c => c.id !== id));
  }

  async function onSearch(cityToSearch) {
    try{
      let json = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&units=metric&appid=${apiKey}`);
      let data = json.data;

        const city = {
          min: Math.round(data.main.temp_min),
          max: Math.round(data.main.temp_max),
          img: data.weather[0].icon,
          id: data.id,
          wind: data.wind.speed,
          temp: Math.round(data.main.temp),
          name: data.name,
          weather: data.weather[0].main,
          clouds: data.clouds.all,
          latitud: data.coord.lat,
          longitud: data.coord.lon
        };

        cities.some((e) => e.name === city.name)
        ? Swal.fire({
            title: 'Error!',
            text: "You've already searched for that city!",
            icon: 'warning',
            confirmButtonText: 'Ok',
          })
        : setCities((oldCities) => [...oldCities, city]);
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'The city was not found.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
  }

  return (<>
    <Nav onSearch={onSearch}/>
      <Routes>
        <Route path='/' element={<Cards cities={cities} onClose={onClose}/>} />
      </Routes> 
    <Footer/>
      
  </>);
}

export default App;
