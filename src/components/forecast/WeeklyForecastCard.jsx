import { WiCloud, WiDaySunny, WiFog, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";
import { useThemeContext } from "../../context/ThemeContext";
import { formatDayName, formatShortDate, getDailyForecast } from "../../utils/forecastUtils";
import { formatDegrees, formatWindSpeed } from "../../utils/units";

function WeatherIcon({ main }) {
  const type = (main || "").toLowerCase();
  if (type.includes("thunder")) return <WiThunderstorm className="text-2xl text-cyan-500" />;
  if (type.includes("rain") || type.includes("drizzle")) return <WiRain className="text-2xl text-cyan-500" />;
  if (type.includes("snow")) return <WiSnow className="text-2xl text-slate-400" />;
  if (type.includes("cloud")) return <WiCloud className="text-2xl text-slate-400" />;
  if (["mist","fog","haze","smoke"].some((t) => type.includes(t))) return <WiFog className="text-2xl text-slate-400" />;
  return <WiDaySunny className="text-2xl text-amber-400" />;
}

export default function WeeklyForecastCard({ forecast }) {
  const { temperatureUnit, windSpeedUnit, mode } = useThemeContext();
  const isDark = mode === "dark";
  const dailyItems = getDailyForecast(forecast, 7);

  const card  = "bg-[var(--panel)] text-white backdrop-blur-sm";
  const inner = "bg-[var(--panel-muted)] text-white";
  const muted = isDark ? "text-slate-400" : "text-white/70";
  const sub   = isDark ? "text-slate-300" : "text-white/80";

  if (dailyItems.length === 0) {
    return <div className={`rounded-3xl p-6 shadow-lg ${card}`}>Weekly forecast unavailable.</div>;
  }

  return (
    <div className={`rounded-3xl p-4 shadow-lg sm:p-6 ${card}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.25em] sm:text-sm ${muted}`}>Weekly forecast</p>
      <p className="mt-3 text-xl font-bold sm:text-2xl">Upcoming days</p>
      <p className={`mt-2 text-xs sm:text-sm ${muted}`}>One forecast per calendar date, grouped from the API's 3-hour data.</p>

      <div className="mt-4 space-y-3 sm:mt-6">
        {dailyItems.map((day) => (
          <div key={day.date} className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 ${inner}`}>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold sm:text-base">{formatDayName(day.date)}</p>
              <p className={`mt-1 text-xs sm:text-sm ${muted}`}>{formatShortDate(day.date)}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <WeatherIcon main={day.weather?.[0]?.main} />
              <p className={`hidden max-w-[120px] truncate text-sm capitalize sm:block ${sub}`}>
                {day.weather?.[0]?.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold sm:text-2xl">{formatDegrees(day.temp, temperatureUnit)}</p>
              <p className={`mt-1 text-xs sm:text-sm ${muted}`}>
                {formatDegrees(day.maxTemp, temperatureUnit)} / {formatDegrees(day.minTemp, temperatureUnit)}
              </p>
              <p className={`mt-1 text-xs ${muted}`}>{formatWindSpeed(day.windSpeed, windSpeedUnit)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
