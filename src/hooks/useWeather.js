import { useCallback, useState } from "react";
import { getWeatherData } from "../services/weatherApi";

export function useWeather(initialCity = "Bangalore") {
  const [city, setCity] = useState(initialCity);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildAlerts = useCallback((weatherData, forecastData) => {
    const alertsList = [];
    const weatherMain = weatherData.weather?.[0]?.main?.toLowerCase() || "";
    const weatherDescription =
      weatherData.weather?.[0]?.description?.toLowerCase() || "";
    const cloudiness = weatherData.clouds?.all ?? 0;

    if (
      weatherMain.includes("rain") ||
      weatherMain.includes("drizzle") ||
      weatherMain.includes("thunderstorm")
    ) {
      alertsList.push({
        type: "Rain Alert",
        title: "Rain is falling now",
        severity: "High",
        message: `Current weather in ${weatherData.name} shows ${weatherData.weather[0].description}. Carry an umbrella and expect wet roads.`,
      });
    }

    if (weatherMain.includes("snow")) {
      alertsList.push({
        type: "Snow Alert",
        title: "Snow conditions detected",
        severity: "Medium",
        message: `Current weather in ${weatherData.name} is ${weatherData.weather[0].description}. Dress warmly and drive carefully.`,
      });
    }

    if (weatherMain.includes("cloud") || weatherDescription.includes("cloud")) {
      const title = cloudiness >= 70 ? "Heavy cloud cover" : "Cloudy skies";
      const severity = cloudiness >= 70 ? "Medium" : "Low";
      alertsList.push({
        type: "Cloud Alert",
        title,
        severity,
        message: `Sky conditions in ${weatherData.name} are ${weatherData.weather[0].description}. Visibility may be reduced and lighting will be muted.`,
      });
    }

    if (weatherMain.includes("storm") || weatherDescription.includes("storm")) {
      alertsList.unshift({
        type: "Storm Alert",
        title: "Storm detected",
        severity: "High",
        message: `Severe storm conditions are reported in ${weatherData.name}. Avoid outdoor activities if possible.`,
      });
    }

    const forecastItems = forecastData?.list || [];
    const highPop = forecastItems.find((item) => (item.pop || 0) >= 0.65);
    if (highPop) {
      alertsList.push({
        type: "Rain Warning",
        title: "High rain probability ahead",
        severity: "Medium",
        message: `${Math.round((highPop.pop || 0) * 100)}% chance of rain around ${new Date(highPop.dt * 1000).toLocaleString([], {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}. Plan outdoor travel with care.`,
      });
    }

    const strongWind = forecastItems.find((item) => (item.wind?.speed || 0) >= 10);
    if (strongWind) {
      alertsList.push({
        type: "Wind Advisory",
        title: "Strong winds expected",
        severity: "Medium",
        message: `Forecast wind speeds may reach ${Math.round((strongWind.wind.speed || 0) * 3.6)} km/h. Secure loose outdoor items.`,
      });
    }

    const veryHot = forecastItems.find((item) => (item.main?.temp || 0) >= 38);
    if (veryHot) {
      alertsList.push({
        type: "Heat Warning",
        title: "High temperature expected",
        severity: "High",
        message: `Forecast temperature may reach ${Math.round(veryHot.main.temp)}C. Stay hydrated and avoid prolonged direct sun.`,
      });
    }

    const veryCold = forecastItems.find((item) => (item.main?.temp || 0) <= 2);
    if (veryCold) {
      alertsList.push({
        type: "Cold Warning",
        title: "Low temperature expected",
        severity: "Medium",
        message: `Forecast temperature may drop to ${Math.round(veryCold.main.temp)}C. Dress warmly and watch for slippery surfaces.`,
      });
    }

    return alertsList;
  }, []);

  const fetchWeather = useCallback(
    async (queryCity = city) => {
      const normalizedCity =
        typeof queryCity === "string"
          ? queryCity.trim()
          : typeof queryCity?.target?.value === "string"
            ? queryCity.target.value.trim()
            : city;

      setLoading(true);
      setError(null);
      setAlerts([]);

      try {
        const data = await getWeatherData(normalizedCity);
        setWeather(data.current);
        setForecast(data.forecast);
        setCity(normalizedCity);
        setAlerts(buildAlerts(data.current, data.forecast));
        return data;
      } catch (err) {
        setWeather(null);
        setForecast(null);
        setAlerts([]);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [buildAlerts, city],
  );

  return {
    city,
    setCity,
    weather,
    forecast,
    alerts,
    loading,
    error,
    fetchWeather,
  };
}
