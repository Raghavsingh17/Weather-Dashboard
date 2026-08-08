import { useMemo } from "react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaSun, FaWind, FaCompass, FaShieldHalved } from "react-icons/fa6";
import { useThemeContext } from "../../context/ThemeContext";
import { formatWindSpeed } from "../../utils/units";
import SpotlightCard from "../reactbits/SpotlightCard";

export default function UVAndWindIntelligence({ weather, forecast }) {
  const { windSpeedUnit, textPrimary, textSecondary, textMuted, preset } = useThemeContext();

  // ── 1. UV Index Calculations ──
  const uvIndex = useMemo(() => {
    if (!weather) return 0;
    const cloudiness = weather.clouds?.all || 0;
    if (!weather.sys?.sunrise || !weather.sys?.sunset) return 0;
    const now = weather.dt || weather.sys.sunrise;
    const isDaytime = now > weather.sys.sunrise && now < weather.sys.sunset;
    if (!isDaytime) return 0;
    return Math.max(0, Math.round(8 * (1 - cloudiness / 100)));
  }, [weather]);

  const getUVLevel = (uv) => {
    if (uv <= 2) return { level: "Low", color: "#34d399", barColor: "#10b981", badge: "Low Risk" };
    if (uv <= 5) return { level: "Moderate", color: "#fbbf24", barColor: "#f59e0b", badge: "Moderate Risk" };
    if (uv <= 7) return { level: "High", color: "#f97316", barColor: "#ea580c", badge: "High Risk" };
    if (uv <= 10) return { level: "Very High", color: "#f87171", barColor: "#ef4444", badge: "Very High Risk" };
    return { level: "Extreme", color: "#c084fc", barColor: "#a855f7", badge: "Extreme Danger" };
  };

  const { level, color, barColor, badge } = getUVLevel(uvIndex);

  const uvAdvice =
    uvIndex <= 2
      ? "Minimal sun protection required for normal outdoor activities."
      : uvIndex <= 5
        ? "Wear SPF 30+ sunscreen, protective hat, and sunglasses outdoors."
        : uvIndex <= 7
          ? "High UV hazard — seek shade during peak daylight hours (10 AM - 4 PM)."
          : "Extreme UV hazard — avoid direct sun exposure without protective gear.";

  // Mini Hourly UV Chart Data (08:00 - 18:00)
  const hourlyUVData = useMemo(() => {
    const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
    const baseUV = uvIndex || 5;
    const factors = [0.3, 0.7, 1.0, 0.9, 0.5, 0.1];
    return hours.map((h, i) => ({
      time: h,
      uv: Math.min(11, Math.max(0, Math.round(baseUV * factors[i]))),
    }));
  }, [uvIndex]);

  // ── 2. Wind Calculations ──
  const windSpeed = weather?.wind?.speed || 0;
  const windGust = weather?.wind?.gust || null;
  const windDeg = weather?.wind?.deg || 0;
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const direction = dirs[Math.round(windDeg / 45) % 8];

  const formattedWindSpeed = formatWindSpeed(windSpeed, windSpeedUnit);
  const formattedGustSpeed = windGust ? formatWindSpeed(windGust, windSpeedUnit) : null;

  // Mini Hourly Wind Trend Chart Data from forecast
  const hourlyWindData = useMemo(() => {
    if (!forecast?.list?.length) return [];
    return forecast.list.slice(0, 7).map((item) => {
      const time = item.dt_txt?.split(" ")[1]?.slice(0, 5) || "";
      const spd = item.wind?.speed || 0;
      return {
        time,
        speed: Math.round(spd * (windSpeedUnit === "mph" ? 2.237 : windSpeedUnit === "ms" ? 1 : 3.6)),
      };
    });
  }, [forecast, windSpeedUnit]);

  if (!weather) return null;

  return (
    <SpotlightCard className="p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── LEFT COLUMN: UV Index Intelligence ── */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {/* Header Tag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: preset.accentPrimary }}>
                <FaSun className="text-amber-400" />
                UV Radiation Index
              </div>
              <span
                className="rounded-full px-3 py-1 text-[10px] font-black border"
                style={{
                  backgroundColor: `${barColor}18`,
                  color: color,
                  borderColor: `${barColor}40`,
                }}
              >
                {badge}
              </span>
            </div>

            {/* Score & Health Status */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-6xl font-black tracking-tight" style={{ color: color }}>
                {uvIndex}
              </span>
              <div>
                <p className="text-2xl font-black" style={{ color: color }}>{level}</p>
                <p className={`text-xs font-bold ${textMuted}`}>Peak Solar Radiation Score</p>
              </div>
            </div>

            {/* Progress Arc Bar */}
            <div className="mt-5">
              <div
                className="h-3 w-full overflow-hidden rounded-full border"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 shadow-md"
                  style={{
                    width: `${Math.min((uvIndex / 11) * 100, 100)}%`,
                    backgroundColor: barColor,
                    boxShadow: `0 0 14px ${barColor}70`,
                  }}
                />
              </div>
              <div className={`mt-2 flex justify-between text-[10px] font-extrabold ${textMuted}`}>
                <span>0 Low</span>
                <span>3 Mod</span>
                <span>6 High</span>
                <span>8 V.High</span>
                <span>11+ Extreme</span>
              </div>
            </div>

            {/* Advisory */}
            <p className={`mt-4 text-xs font-bold leading-relaxed flex items-start gap-2 ${textSecondary}`}>
              <FaShieldHalved className="text-amber-400 shrink-0 mt-0.5" />
              <span>{uvAdvice}</span>
            </p>
          </div>

          {/* Mini Hourly UV Bar Chart */}
          <div className="pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-2`}>
              Hourly UV Intensity Arc (08:00 – 18:00)
            </p>
            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyUVData} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis domain={[0, 11]} stroke="#64748b" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                    formatter={(v) => [`UV Index: ${v}`, "Intensity"]}
                  />
                  <Bar dataKey="uv" fill={preset.accentPrimary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Wind & Direction Intelligence (Divider on Desktop) ── */}
        <div className="border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between space-y-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            {/* Header Tag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: preset.accentPrimary }}>
                <FaWind className="text-cyan-400" />
                Wind Velocity & Direction
              </div>
              <span
                className="rounded-full px-3 py-1 text-[10px] font-black border"
                style={{
                  backgroundColor: `${preset.accentPrimary}18`,
                  color: preset.accentPrimary,
                  borderColor: `${preset.accentPrimary}35`,
                }}
              >
                {direction} ({windDeg}°)
              </span>
            </div>

            {/* Compass & Speed Details */}
            <div className="mt-5 flex items-center gap-6">
              {/* SVG Animated Compass */}
              <div className="relative h-24 w-24 shrink-0">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke={`${preset.accentPrimary}30`} strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="50" y="15" textAnchor="middle" fill="rgba(255,255,255,0.50)" fontSize="9" fontWeight="bold">N</text>
                  <text x="85" y="53" textAnchor="middle" fill="rgba(255,255,255,0.50)" fontSize="9" fontWeight="bold">E</text>
                  <text x="50" y="92" textAnchor="middle" fill="rgba(255,255,255,0.50)" fontSize="9" fontWeight="bold">S</text>
                  <text x="15" y="53" textAnchor="middle" fill="rgba(255,255,255,0.50)" fontSize="9" fontWeight="bold">W</text>
                  <polygon
                    points="50,18 43,42 57,42"
                    fill={preset.accentPrimary}
                    style={{
                      transformOrigin: "50px 50px",
                      transform: `rotate(${windDeg}deg)`,
                      transition: "transform 1s ease-out",
                      filter: `drop-shadow(0 0 6px ${preset.accentPrimary}90)`,
                    }}
                  />
                </svg>
              </div>

              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-black ${textPrimary}`}>
                    {formattedWindSpeed.split(" ")[0]}
                  </span>
                  <span className={`text-xs font-bold ${textSecondary}`}>
                    {formattedWindSpeed.split(" ")[1]}
                  </span>
                </div>

                <p className={`mt-1 text-xs font-bold ${textMuted} flex items-center gap-1`}>
                  <FaCompass className="text-cyan-400" />
                  Blowing from {direction} ({windDeg}°)
                </p>

                {formattedGustSpeed && (
                  <div
                    className="mt-3 rounded-xl p-2 border flex items-center justify-between"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <span className={`text-[10px] font-black uppercase ${textMuted}`}>Peak Gust</span>
                    <span className="text-xs font-black" style={{ color: preset.accentSecondary }}>
                      {formattedGustSpeed}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mini Hourly Wind Speed Sparkline */}
          <div className="pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-2`}>
              Wind Speed Trend Sparkline
            </p>
            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyWindData} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                    formatter={(v) => [`${v} ${windSpeedUnit}`, "Wind Speed"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="speed"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#windGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
