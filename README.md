# Weather App

Aplicación del tiempo que consume la API de [OpenWeather](https://openweathermap.org/api) para mostrar el clima actual por ciudad.

## Configuración

1. Obtén una API key gratuita en [OpenWeather](https://openweathermap.org/api).
2. Copia el archivo de ejemplo y añade tu clave:
   ```bash
   cp .env.example .env
   ```
3. Edita `.env` y reemplaza `tu_api_key_aqui` por tu API key:
   ```
   REACT_APP_OPENWEATHER_API_KEY=tu_clave_real
   ```

## Scripts

- **`npm start`** — Ejecuta la app en desarrollo ([http://localhost:3000](http://localhost:3000)).
- **`npm run build`** — Genera la build de producción.
- **`npm test`** — Ejecuta los tests.

## Stack

- React 18
- React Router
- Tailwind CSS
- SweetAlert2
- OpenWeather API (Current Weather)

## Funcionalidades

- Búsqueda por nombre de ciudad
- Temperatura actual, mínima y máxima
- Descripción del tiempo (en español)
- Humedad, viento y presión
- Iconos oficiales de OpenWeather (HTTPS)
- Mensajes de error claros (ciudad no encontrada, API key inválida, etc.)
- Diseño responsive y accesible
