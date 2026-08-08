import { motion } from "framer-motion";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from "react-icons/wi";
import { useThemeContext } from "../../context/ThemeContext";
import { formatWindSpeed } from "../../utils/units";
import SpotlightCard from "../reactbits/SpotlightCard";
import ShinyText from "../reactbits/ShinyText";

function WeatherIcon({ main, size = "text-6xl" }) {
  const type = (main || "").toLowerCase();
  if (type.includes("thunder")) return <WiThunderstorm className={`${size} drop-shadow-md`} style={{ color: "#f59e0b" }} />;
  if (type.includes("rain") || type.includes("drizzle")) return <WiRain className={`${size} drop-shadow-md`} style={{ color: "#38bdf8" }} />;
  if (type.includes("snow")) return <WiSnow className={`${size} drop-shadow-md`} style={{ color: "#a5f3fc" }} />;
  if (type.includes("cloud")) return <WiCloud className={`${size} drop-shadow-md`} style={{ color: "#94a3b8" }} />;
  if (type.includes("mist") || type.includes("fog") || type.includes("haze"))
    return <WiFog className={`${size} drop-shadow-md`} style={{ color: "#64748b" }} />;
  return <WiDaySunny className={`${size} drop-shadow-md`} style={{ color: "#fbbf24" }} />;
}

function StatBox({ label, value, accentPrimary }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.03 }}
      className="flex flex-col items-center justify-center rounded-2xl px-3 py-3.5 text-center border transition-all duration-200"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <p
        className="text-[10px] font-black uppercase tracking-wider"
        style={{ color: accentPrimary }}
      >
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-200">{value}</p>
    </motion.div>
  );
}

export default function WeatherCard({ weather }) {
  const {
    temperatureUnit,
    windSpeedUnit,
    textPrimary,
    textSecondary,
    textMuted,
    preset,
  } = useThemeContext();

  if (!weather?.weather?.[0]) return null;

  const toUnit = (c) =>
    temperatureUnit === "fahrenheit" ? Math.round((c * 9) / 5 + 32) : Math.round(c);

  const temp = toUnit(weather.main?.temp ?? 0);
  const feels = toUnit(weather.main?.feels_like ?? 0);
  const tempMax = toUnit(weather.main?.temp_max ?? 0);
  const tempMin = toUnit(weather.main?.temp_min ?? 0);
  const unit = temperatureUnit === "fahrenheit" ? "°F" : "°C";

  const sunrise = weather.sys?.sunrise
    ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  const sunset = weather.sys?.sunset
    ? new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const formattedWind = formatWindSpeed(weather.wind?.speed ?? 0, windSpeedUnit);

  return (
    <SpotlightCard className="p-6 sm:p-8">
      {/* Ambient glow orb inside card */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-30"
        style={{ background: `radial-gradient(circle, ${preset.accentPrimary}, transparent 70%)` }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <span
            className="rounded-full px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
              boxShadow: `0 0 12px ${preset.accentPrimary}40`,
            }}
          >
            {weather.sys?.country ? `${weather.sys.country}` : "Live Weather"}
          </span>
          <h2 className={`mt-3 text-3xl font-black tracking-tight sm:text-5xl ${textPrimary}`}>
            <ShinyText>{weather.name}</ShinyText>
          </h2>
          <p className={`mt-1 font-semibold capitalize text-sm sm:text-base ${textSecondary}`}>
            {weather.weather[0]?.description}
          </p>
        </div>
        <WeatherIcon main={weather.weather[0]?.main} size="text-7xl sm:text-8xl" />
      </div>

      {/* Main temp display */}
      <div className="mt-6 flex flex-wrap items-baseline gap-4 relative z-10">
        <span className={`text-6xl font-black tracking-tighter sm:text-7xl ${textPrimary}`}>
          {temp}
          <span className="text-4xl font-black" style={{ color: preset.accentPrimary }}>{unit}</span>
        </span>
        <div className="text-xs font-bold space-y-0.5">
          <p className={textSecondary}>
            Feels like <span className={`font-black ${textPrimary}`}>{feels}{unit}</span>
          </p>
          <p className={`text-[11px] font-black ${textMuted}`}>
            HIGH {tempMax}° / LOW {tempMin}°
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-6 relative z-10">
        <StatBox label="Humidity" value={`${weather.main?.humidity ?? "--"}%`} accentPrimary={preset.accentPrimary} />
        <StatBox label="Wind" value={formattedWind} accentPrimary={preset.accentPrimary} />
        <StatBox label="Pressure" value={`${weather.main?.pressure ?? "--"} hPa`} accentPrimary={preset.accentPrimary} />
        <StatBox label="Visibility" value={`${weather.visibility ? Math.round(weather.visibility / 1000) : "--"} km`} accentPrimary={preset.accentPrimary} />
        <StatBox label="Sunrise" value={sunrise} accentPrimary={preset.accentPrimary} />
        <StatBox label="Sunset" value={sunset} accentPrimary={preset.accentPrimary} />
      </div>
    </SpotlightCard>
  );
}
