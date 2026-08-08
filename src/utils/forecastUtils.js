export function getHourlyIntervals(forecast, count = 8) {
  const now = Math.floor(Date.now() / 1000);
  return (forecast?.list || []).filter((item) => item.dt >= now).slice(0, count);
}

export function getDailyForecast(forecast, days = 7) {
  const dailyMap = new Map();

  for (const item of forecast?.list || []) {
    const dateKey = item.dt_txt.split(" ")[0];

    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date: dateKey,
        dt: item.dt,
        minTemp: item.main.temp,
        maxTemp: item.main.temp,
        precipitation: item.pop || 0,
        windSpeed: item.wind?.speed || 0,
        humidity: item.main?.humidity || 0,
        items: [item],
      });
      continue;
    }

    const day = dailyMap.get(dateKey);
    day.minTemp = Math.min(day.minTemp, item.main.temp);
    day.maxTemp = Math.max(day.maxTemp, item.main.temp);
    day.precipitation = Math.max(day.precipitation, item.pop || 0);
    day.windSpeed = Math.max(day.windSpeed, item.wind?.speed || 0);
    day.humidity += item.main?.humidity || 0;
    day.items.push(item);
  }

  return Array.from(dailyMap.values())
    .slice(0, days)
    .map((day) => {
      const midday =
        day.items.find((item) => item.dt_txt.includes("12:00:00")) ||
        day.items[Math.floor(day.items.length / 2)] ||
        day.items[0];

      return {
        date: day.date,
        dt: day.dt,
        minTemp: Math.round(day.minTemp),
        maxTemp: Math.round(day.maxTemp),
        temp: Math.round(midday.main.temp),
        feelsLike: Math.round(midday.main.feels_like),
        precipitation: day.precipitation,
        windSpeed: day.windSpeed,
        humidity: Math.round(day.humidity / Math.max(day.items.length, 1)),
        weather: midday.weather,
      };
    });
}

export function formatDayName(dateStr) {
  const date = new Date(`${dateStr}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);

  if (compare.getTime() === today.getTime()) return "Today";
  if (compare.getTime() === today.getTime() + 86400000) return "Tomorrow";

  return date.toLocaleDateString([], { weekday: "long" });
}

export function formatShortDayName(dateStr) {
  const full = formatDayName(dateStr);
  if (full === "Today" || full === "Tomorrow") return full;
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString([], {
    weekday: "short",
  });
}

export function formatShortDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export function formatHourlyLabel(item) {
  const [datePart, timePart] = item.dt_txt.split(" ");

  return {
    date: formatShortDate(datePart),
    dayName: formatShortDayName(datePart),
    time: timePart.slice(0, 5),
  };
}
