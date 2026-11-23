import { useState, useEffect } from 'react';

// Caché en memoria para no repetir peticiones innecesarias a Open-Meteo durante la sesión
const weatherCache = new Map();

// Coordenadas geográficas de cada destino por si se consulta por ID
export const COORDENADAS_DESTINOS = {
  paris: { latitude: 48.8566, longitude: 2.3522 },
  tokio: { latitude: 35.6762, longitude: 139.6503 },
  cusco: { latitude: -13.5319, longitude: -71.9675 },
  cancun: { latitude: 21.1619, longitude: -86.8515 },
  roma: { latitude: 41.9028, longitude: 12.4964 },
  bariloche: { latitude: -41.1335, longitude: -71.3103 },
};

/**
 * Traduce el código meteorológico WMO de Open-Meteo a una descripción e ícono en español.
 */
export function interpretWeatherCode(code) {
  if (code === 0) return { label: 'Despejado', icon: '☀️' };
  if (code === 1 || code === 2) return { label: 'Parcialmente nublado', icon: '⛅' };
  if (code === 3) return { label: 'Nublado', icon: '☁️' };
  if (code === 45 || code === 48) return { label: 'Neblina', icon: '🌫️' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Llovizna', icon: '🌦️' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Lluvia', icon: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Nieve', icon: '❄️' };
  if ([95, 96, 99].includes(code)) return { label: 'Tormenta', icon: '⛈️' };
  return { label: 'Clima agradable', icon: '🌤️' };
}

/**
 * Hook personalizado que consulta en tiempo real la API pública de Open-Meteo
 * para obtener la temperatura actual (°C) y condición climática del destino.
 */
export function useClimaReal({ destinationId, latitude, longitude, fallbackClimate }) {
  const defaultCoords = COORDENADAS_DESTINOS[String(destinationId || '').toLowerCase()];
  const lat = latitude != null ? latitude : defaultCoords?.latitude;
  const lon = longitude != null ? longitude : defaultCoords?.longitude;
  const cacheKey = lat != null && lon != null ? `${lat},${lon}` : null;

  const [weather, setWeather] = useState(() => {
    if (cacheKey && weatherCache.has(cacheKey)) {
      return weatherCache.get(cacheKey);
    }
    return null;
  });

  useEffect(() => {
    if (lat == null || lon == null || !cacheKey) return;

    if (weatherCache.has(cacheKey)) {
      setWeather(weatherCache.get(cacheKey));
      return;
    }

    // En entorno de pruebas automatizadas (Jest), usamos el fallback para no depender de red externa
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    let isMounted = true;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo obtener el clima en vivo');
        return res.json();
      })
      .then((data) => {
        if (!isMounted || !data?.current_weather) return;
        const temp = Math.round(data.current_weather.temperature);
        const wind = Math.round(data.current_weather.windspeed);
        const info = interpretWeatherCode(data.current_weather.weathercode);

        const formatted = {
          temperature: temp,
          windspeed: wind,
          label: info.label,
          icon: info.icon,
          summary: `${temp}°C • ${info.label}`,
        };

        weatherCache.set(cacheKey, formatted);
        setWeather(formatted);
      })
      .catch(() => {
        // Si no hay conexión a internet, conserva silenciosamente el clima de respaldo
      });

    return () => {
      isMounted = false;
    };
  }, [cacheKey, lat, lon]);

  if (weather) {
    return {
      icon: weather.icon,
      text: `${weather.temperature}°C ahora (${weather.label})`,
      isLive: true,
    };
  }

  return {
    icon: '🌤️',
    text: fallbackClimate || 'Clima templado',
    isLive: false,
  };
}
