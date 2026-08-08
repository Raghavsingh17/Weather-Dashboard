import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { WiSunrise, WiSunset, WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiSnow, WiFog } from "react-icons/wi";
import { FaSun, FaWind, FaDroplet, FaEye, FaGauge } from "react-icons/fa6";
import { useThemeContext } from "../../context/ThemeContext";
import { formatDegrees } from "../../utils/units";
import SpotlightCard from "../reactbits/SpotlightCard";

function WeatherIcon({ main, size = "text-4xl" }) {
  const type = (main || "").toLowerCase();
  if (type.includes("thunder")) return <WiThunderstorm className={`${size}`} style={{ color: "#f59e0b" }} />;
  if (type.includes("rain") || type.includes("drizzle")) return <WiRain className={`${size}`} style={{ color: "#38bdf8" }} />;
  if (type.includes("snow")) return <WiSnow className={`${size}`} style={{ color: "#a5f3fc" }} />;
  if (type.includes("cloud")) return <WiCloud className={`${size}`} style={{ color: "#94a3b8" }} />;
  if (type.includes("mist") || type.includes("fog") || type.includes("haze"))
    return <WiFog className={`${size}`} style={{ color: "#64748b" }} />;
  return <WiDaySunny className={`${size}`} style={{ color: "#fbbf24" }} />;
}

export default function DailyForecastInspector({ forecast }) {
  const { temperatureUnit, textPrimary, textSecondary, textMuted, preset } = useThemeContext();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Group 5-day forecast by date
  const dayGroups = useMemo(() => {
    if (!forecast?.list?.length) return [];

    const map = new Map();
    forecast.list.forEach((item) => {
      const dateStr = item.dt_txt?.split(" ")[0] || "Today";
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr).push(item);
    });

    return Array.from(map.entries()).map(([dateStr, items], index) => {
      const dateObj = new Date(`${dateStr}T12:00:00`);
      let label = dateObj.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
      if (index === 0) label = `Today (${dateObj.toLocaleDateString([], { month: "short", day: "numeric" })})`;
      if (index === 1) label = `Tomorrow (${dateObj.toLocaleDateString([], { month: "short", day: "numeric" })})`;

      // Compute min/max temp and average metrics
      let maxTemp = -Infinity;
      let minTemp = Infinity;
      let maxWind = 0;
      let totalHumidity = 0;

      items.forEach((it) => {
        if (it.main?.temp_max > maxTemp) maxTemp = it.main.temp_max;
        if (it.main?.temp_min < minTemp) minTemp = it.main.temp_min;
        if (it.wind?.speed > maxWind) maxWind = it.wind.speed;
        totalHumidity += it.main?.humidity || 0;
      });

      const avgHumidity = Math.round(totalHumidity / items.length);

      return {
        dateStr,
        label,
        items,
        maxTemp,
        minTemp,
        maxWind: Math.round(maxWind * 3.6),
        avgHumidity,
        mainCondition: items[Math.floor(items.length / 2)]?.weather?.[0] || items[0]?.weather?.[0],
      };
    }).slice(0, 3); // 3 days
  }, [forecast]);

  const activeDay = dayGroups[selectedDayIndex] || dayGroups[0];

  // Chart data for active day
  const chartData = useMemo(() => {
    if (!activeDay?.items) return [];
    return activeDay.items.map((it) => {
      const time = it.dt_txt?.split(" ")[1]?.slice(0, 5) || "";
      return {
        time,
        temp: Math.round(it.main?.temp || 0),
        feelsLike: Math.round(it.main?.feels_like || 0),
        pop: Math.round((it.pop || 0) * 100),
        humidity: it.main?.humidity || 0,
      };
    });
  }, [activeDay]);

  // Extract period breakdowns (Morning, Afternoon, Evening, Night)
  const periods = useMemo(() => {
    if (!activeDay?.items) return [];
    const items = activeDay.items;

    const findByHour = (startH, endH) =>
      items.find((it) => {
        const h = parseInt(it.dt_txt?.split(" ")[1]?.slice(0, 2) || "0", 10);
        return h >= startH && h <= endH;
      }) || items[0];

    return [
      { name: "Morning", time: "06:00 - 11:00", item: findByHour(6, 11) },
      { name: "Afternoon", time: "12:00 - 17:00", item: findByHour(12, 17) },
      { name: "Evening", time: "18:00 - 21:00", item: findByHour(18, 21) },
      { name: "Night", time: "22:00 - 05:00", item: findByHour(22, 23) || findByHour(0, 5) },
    ];
  }, [activeDay]);

  if (!dayGroups.length) return null;

  return (
    <div className="space-y-6">
      {/* ── Day Selector Pills ── */}
      <div className="flex flex-wrap items-center gap-3">
        {dayGroups.map((d, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={d.dateStr}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className="rounded-2xl px-6 py-3 text-xs sm:text-sm font-black transition-all border"
              style={
                isSelected
                  ? {
                      background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                      color: "#ffffff",
                      borderColor: "transparent",
                      boxShadow: `0 0 16px ${preset.accentPrimary}40`,
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.08)",
                      color: "#94a3b8",
                    }
              }
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* ── 24-Hour Temperature Spline Graph ── */}
      <SpotlightCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-black uppercase tracking-widest ${textMuted}`}>
              24-Hour Hourly Trajectory
            </p>
            <h3 className={`mt-1 text-xl font-black ${textPrimary}`}>
              Temperature & Rain Profile ({activeDay?.label})
            </h3>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-black border"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
              color: preset.accentPrimary,
            }}
          >
            {activeDay?.mainCondition?.description}
          </span>
        </div>

        <div className="mt-6 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={preset.accentPrimary} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={preset.accentPrimary} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  color: "#f8fafc",
                  fontWeight: "bold",
                }}
                formatter={(val, name) => [
                  name === "temp" ? formatDegrees(val, temperatureUnit) : `${val}%`,
                  name === "temp" ? "Temperature" : "Rain Chance",
                ]}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke={preset.accentPrimary}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SpotlightCard>

      {/* ── 4 Time Period Cards (Morning, Afternoon, Evening, Night) ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {periods.map((p) => {
          if (!p.item) return null;
          return (
            <SpotlightCard key={p.name} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div>
                    <p className={`font-black text-sm ${textPrimary}`}>{p.name}</p>
                    <p className={`text-[11px] font-bold ${textMuted}`}>{p.time}</p>
                  </div>
                  <WeatherIcon main={p.item.weather?.[0]?.main} size="text-3xl" />
                </div>

                <div className="mt-4">
                  <p className={`text-3xl font-black ${textPrimary}`}>
                    {formatDegrees(p.item.main?.temp || 0, temperatureUnit)}
                  </p>
                  <p className={`mt-1 text-xs font-semibold capitalize ${textSecondary}`}>
                    {p.item.weather?.[0]?.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t text-xs font-bold" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className={textMuted}>Feels {formatDegrees(p.item.main?.feels_like || 0, temperatureUnit)}</span>
                <span className="text-cyan-400">{Math.round((p.item.pop || 0) * 100)}% Rain</span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* ── Granular Day Inspector Matrix Grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Sunrise / Sunset */}
        <SpotlightCard className="p-5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ color: preset.accentPrimary }}>
            <WiSunrise size={22} /> Sunrise & Sunset
          </div>
          <div className="mt-4 flex items-center justify-around">
            <div className="text-center">
              <WiSunrise className="mx-auto text-4xl text-amber-400" />
              <p className={`text-xs font-bold mt-1 ${textMuted}`}>Sunrise</p>
              <p className={`text-base font-black ${textPrimary}`}>06:12 AM</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <WiSunset className="mx-auto text-4xl text-orange-400" />
              <p className={`text-xs font-bold mt-1 ${textMuted}`}>Sunset</p>
              <p className={`text-base font-black ${textPrimary}`}>06:48 PM</p>
            </div>
          </div>
        </SpotlightCard>

        {/* Peak UV Index */}
        <SpotlightCard className="p-5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
            <FaSun /> Max UV Index
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-black text-amber-400">7.8</span>
            <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-black text-amber-300">
              Very High
            </span>
          </div>
          <p className={`mt-2 text-xs font-bold ${textSecondary}`}>Protection required between 11 AM - 3 PM.</p>
        </SpotlightCard>

        {/* Peak Wind Gust */}
        <SpotlightCard className="p-5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-400">
            <FaWind /> Peak Wind Gust
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-black text-cyan-400">{activeDay?.maxWind || 24}</span>
            <span className="text-xs font-bold text-cyan-300">km/h SW</span>
          </div>
          <p className={`mt-2 text-xs font-bold ${textSecondary}`}>Gentle to moderate breeze throughout day.</p>
        </SpotlightCard>

        {/* Humidity Range */}
        <SpotlightCard className="p-5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400">
            <FaDroplet /> Humidity Level
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-black text-blue-400">{activeDay?.avgHumidity || 65}%</span>
            <span className={`text-xs font-bold ${textMuted}`}>Average</span>
          </div>
          <p className={`mt-2 text-xs font-bold ${textSecondary}`}>Comfortable moisture level in air.</p>
        </SpotlightCard>

        {/* Visibility */}
        <SpotlightCard className="p-5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400">
            <FaEye /> Visibility Distance
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-black text-emerald-400">10.0</span>
            <span className="text-xs font-bold text-emerald-300">km (Clear)</span>
          </div>
          <p className={`mt-2 text-xs font-bold ${textSecondary}`}>Excellent sight distance across city region.</p>
        </SpotlightCard>

        {/* Pressure */}
        <SpotlightCard className="p-5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-400">
            <FaGauge /> Barometric Pressure
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-black text-purple-400">1013</span>
            <span className="text-xs font-bold text-purple-300">hPa</span>
          </div>
          <p className={`mt-2 text-xs font-bold ${textSecondary}`}>Stable atmospheric pressure trend.</p>
        </SpotlightCard>
      </div>
    </div>
  );
}
