/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [city, setCity] = useState("Bangalore");

  const value = useMemo(() => ({ city, setCity }), [city]);

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  return useContext(WeatherContext);
}
