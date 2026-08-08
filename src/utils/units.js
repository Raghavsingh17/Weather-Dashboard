export function convertTemperature(value, unit = "celsius") {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return unit === "fahrenheit" ? number * 1.8 + 32 : number;
}

export function formatTemperature(value, unit = "celsius") {
  const converted = convertTemperature(value, unit);
  if (converted === null) return "--";
  return `${Math.round(converted)}°${unit === "fahrenheit" ? "F" : "C"}`;
}

export function formatDegrees(value, unit = "celsius") {
  const converted = convertTemperature(value, unit);
  if (converted === null) return "--";
  return `${Math.round(converted)}°`;
}

export function convertWindSpeed(ms = 0, unit = "kmh") {
  const speed = Number(ms);
  if (!Number.isFinite(speed)) return 0;

  if (unit === "mph") return Math.round(speed * 2.23694);
  if (unit === "ms") return Number(speed.toFixed(1));
  return Math.round(speed * 3.6);
}

export function formatWindSpeed(ms = 0, unit = "kmh") {
  const converted = convertWindSpeed(ms, unit);
  const label = unit === "mph" ? "mph" : unit === "ms" ? "m/s" : "km/h";
  return `${converted} ${label}`;
}
