import { useState } from "react";
import { WiCloud, WiDaySunny, WiFog, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";
import { useThemeContext } from "../../context/ThemeContext";
import { formatDayName, getDailyForecast } from "../../utils/forecastUtils";
import { formatDegrees } from "../../utils/units";

function WeatherIcon({ main, size = "text-4xl" }) {
  const type = (main || "").toLowerCase();
  if (type.includes("thunder")) return <WiThunderstorm className={`${size} text-cyan-500`} />;
  if (type.includes("rain") || type.includes("drizzle")) return <WiRain className={`${size} text-cyan-500`} />;
  if (type.includes("snow")) return <WiSnow className={`${size} text-slate-400`} />;
  if (type.includes("cloud")) return <WiCloud className={`${size} text-slate-400`} />;
  if (["mist","fog","haze","smoke"].some((t) => type.includes(t))) return <WiFog className={`${size} text-slate-400`} />;
  return <WiDaySunny className={`${size} text-amber-400`} />;
}

export default function DailyForecast({ forecast }) {
  const { temperatureUnit, mode } = useThemeContext();
  const isDark = mode === "dark";
  const [selectedIdx, setSelectedIdx] = useState(0);
  const dailyItems = getDailyForecast(forecast, 7);

  const card = "bg-[var(--panel)] text-white backdrop-blur-sm";
  const muted = isDark ? "text-slate-400" : "text-white/70";
  const sub = isDark ? "text-slate-300" : "text-white/80";

  if (dailyItems.length === 0) {
    return <div className={`rounded-3xl p-8 shadow-lg ${card}`}>Daily forecast unavailable.</div>;
  }

  const selectedDay = dailyItems[selectedIdx];
  const dayName = formatDayName(selectedDay.date);
  const dayShort = dayName === "Today" ? "Today" : dayName === "Tomorrow" ? "Tomorrow" : dayName.substring(0, 3);

  return (
    <div className={`rounded-3xl overflow-hidden shadow-lg ${card}`}>
      <div className="flex min-h-80">
        {/* ── LEFT: Day List ── */}
        <div className={`w-20 flex flex-col items-center py-6 space-y-3 border-r ${isDark ? "border-slate-700" : "border-white/20"}`}>
          {dailyItems.map((day, idx) => {
            const dName = formatDayName(day.date);
            const short = dName === "Today" ? "T" : dName === "Tomorrow" ? "T" : dName.substring(0, 1).toUpperCase();
            const isSelected = selectedIdx === idx;
            
            return (
              <button
                key={day.date}
                onClick={() => setSelectedIdx(idx)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl font-semibold text-sm transition-all ${
                  isSelected
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-110"
                    : `${isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-white/10 text-white/70 hover:bg-white/20"}`
                }`}
              >
                {short}
              </button>
            );
          })}
        </div>

        {/* ── RIGHT: Detailed Report ── */}
        <div className="flex-1 p-8">
          {/* Title */}
          <p className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>
            Detailed Weather Report
          </p>

          {/* Day and Icon */}
          <div className="mt-4 flex items-center gap-4 mb-8">
            <WeatherIcon main={selectedDay.weather?.[0]?.main} />
            <div>
              <p className="text-2xl font-bold">{dayShort}</p>
              <p className={`text-sm capitalize ${sub}`}>{selectedDay.weather?.[0]?.description}</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* High */}
            <div>
              <p className={`text-xs ${muted}`}>High</p>
              <p className="mt-1 text-xl font-bold">{formatDegrees(selectedDay.maxTemp, temperatureUnit)}</p>
            </div>

            {/* Low */}
            <div>
              <p className={`text-xs ${muted}`}>Low</p>
              <p className="mt-1 text-xl font-bold">{formatDegrees(selectedDay.minTemp, temperatureUnit)}</p>
            </div>

            {/* Humidity */}
            <div>
              <p className={`text-xs ${muted}`}>💧 Humidity</p>
              <p className="mt-1 text-xl font-bold">{Math.round(selectedDay.humidity || 0)}%</p>
            </div>

            {/* UV Index */}
            <div>
              <p className={`text-xs ${muted}`}>☀️ UV Index</p>
              <p className="mt-1 text-xl font-bold">--</p>
            </div>

            {/* Wind */}
            <div>
              <p className={`text-xs ${muted}`}>🌬️ Wind</p>
              <p className="mt-1 text-xl font-bold">{Math.round(selectedDay.windSpeed * 3.6)} km/h</p>
            </div>

            {/* Moon */}
            <div>
              <p className={`text-xs ${muted}`}>🌙 Moon</p>
              <p className="mt-1 text-xl font-bold">--</p>
            </div>

            {/* Sunrise */}
            <div>
              <p className={`text-xs ${muted}`}>🌅 Sunrise</p>
              <p className="mt-1 text-xl font-bold">--</p>
            </div>

            {/* Pressure */}
            <div>
              <p className={`text-xs ${muted}`}>🔽 Pressure</p>
              <p className="mt-1 text-xl font-bold">--</p>
            </div>

            {/* Rain */}
            <div>
              <p className={`text-xs ${muted}`}>☔ Rain</p>
              <p className="mt-1 text-xl font-bold">{Math.round(selectedDay.precipitation * 100)}%</p>
            </div>

            {/* Clouds */}
            <div>
              <p className={`text-xs ${muted}`}>☁️ Clouds</p>
              <p className="mt-1 text-xl font-bold">--</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
