import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const getWeatherData = async (city) => {
  const query = encodeURIComponent(city.trim());

  // Current Weather
  const weatherRes = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${API_KEY}`,
  );

  // Forecast
  const forecastRes = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&appid=${API_KEY}`,
  );

  return {
    current: weatherRes.data,
    forecast: forecastRes.data,
  };
};
