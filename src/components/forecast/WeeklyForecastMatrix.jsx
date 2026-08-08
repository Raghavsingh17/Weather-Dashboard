import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiSnow, WiFog } from "react-icons/wi";
import { FaShirt, FaPersonRunning, FaWind, FaDroplet, FaGauge } from "react-icons/fa6";
import { useThemeContext } from "../../context/ThemeContext";
import { formatDegrees } from "../../utils/units";
import SpotlightCard from "../reactbits/SpotlightCard";

function ForecastIcon({ main, size = "text-4xl" }) {
  const type = (main || "").toLowerCase();
  if (type.includes("thunder")) return <WiThunderstorm className={`${size}`} style={{ color: "#f59e0b" }} />;
  if (type.includes("rain") || type.includes("drizzle")) return <WiRain className={`${size}`} style={{ color: "#38bdf8" }} />;
  if (type.includes("snow")) return <WiSnow className={`${size}`} style={{ color: "#a5f3fc" }} />;
  if (type.includes("cloud")) return <WiCloud className={`${size}`} style={{ color: "#94a3b8" }} />;
  if (type.includes("mist") || type.includes("fog") || type.includes("haze"))
    return <WiFog className={`${size}`} style={{ color: "#64748b" }} />;
  return <WiDaySunny className={`${size}`} style={{ color: "#fbbf24" }} />;
}

function getRecommendation(condition, precip, maxTemp) {
  const c = (condition || "").toLowerCase();
  if (precip > 0.5 || c.includes("rain") || c.includes("thunder")) {
    return {
      outfit: "Carry a sturdy umbrella and wear a waterproof jacket with non-slip footwear.",
      activity: "Indoor activities recommended. Exercise caution during commute.",
    };
  }
  if (maxTemp > 30) {
    return {
      outfit: "Light breathable cotton clothing, sunglasses, and UV sunscreen.",
      activity: "Great for outdoor morning walks; stay hydrated in peak afternoon heat.",
    };
  }
  return {
    outfit: "Comfortable casual wear with a light sweater for cooler morning breeze.",
    activity: "Perfect outdoor weather for sports, running, and traveling.",
  };
}

export default function WeeklyForecastMatrix({ daily }) {
  const { temperatureUnit, textPrimary, textSecondary, textMuted, preset } = useThemeContext();
  const [expandedDate, setExpandedDate] = useState(null);

  if (!daily || !daily.length) return null;

  // Calculate overall min/max temp across the entire 7 days for range bar scaling
  let globalMin = Infinity;
  let globalMax = -Infinity;
  daily.forEach((d) => {
    if (d.minTemp < globalMin) globalMin = d.minTemp;
    if (d.maxTemp > globalMax) globalMax = d.maxTemp;
  });
  const tempSpan = Math.max(1, globalMax - globalMin);

  const toggleExpand = (date) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div className="space-y-4">
      {daily.map((day) => {
        const isExpanded = expandedDate === day.date;
        const precipPct = Math.round(day.precipitation * 100);
        const hasRain = precipPct > 0;
        const mainDesc = day.weather?.[0]?.description || "Clear";
        const mainType = day.weather?.[0]?.main || "Clear";

        // Calculate bar position %
        const leftPct = Math.max(0, Math.min(100, ((day.minTemp - globalMin) / tempSpan) * 100));
        const widthPct = Math.max(15, Math.min(100 - leftPct, ((day.maxTemp - day.minTemp) / tempSpan) * 100));

        const recommendation = getRecommendation(mainDesc, day.precipitation, day.maxTemp);

        return (
          <SpotlightCard key={day.date} className="p-0 overflow-hidden">
            {/* Clickable Main Row */}
            <button
              type="button"
              onClick={() => toggleExpand(day.date)}
              className="w-full p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left transition-all hover:bg-white/[0.02]"
            >
              {/* Day & Icon */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <ForecastIcon main={mainType} size="text-4xl" />
                <div>
                  <p className={`text-base sm:text-lg font-black ${textPrimary}`}>
                    {new Date(`${day.date}T12:00:00`).toLocaleDateString([], {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs font-semibold capitalize" style={{ color: preset.accentPrimary }}>
                    {mainDesc}
                  </p>
                </div>
              </div>

              {/* Rain Pill */}
              <div className="min-w-[100px]">
                <span
                  className="rounded-full px-3 py-1 text-xs font-black border transition"
                  style={
                    hasRain
                      ? {
                          backgroundColor: "rgba(6, 182, 212, 0.15)",
                          color: "#38bdf8",
                          borderColor: "rgba(6, 182, 212, 0.35)",
                          boxShadow: "0 0 10px rgba(6, 182, 212, 0.2)",
                        }
                      : {
                          backgroundColor: "rgba(255, 255, 255, 0.04)",
                          color: "#94a3b8",
                          borderColor: "rgba(255, 255, 255, 0.08)",
                        }
                  }
                >
                  {precipPct}% Rain
                </span>
              </div>

              {/* Min-Max Temperature Spread Bar */}
              <div className="flex-1 max-w-xs mx-2">
                <div className="flex items-center justify-between text-xs font-black mb-1.5">
                  <span className={textMuted}>{formatDegrees(day.minTemp, temperatureUnit)}</span>
                  <span className={textPrimary}>{formatDegrees(day.maxTemp, temperatureUnit)}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/5 relative overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      marginLeft: `${leftPct}%`,
                      width: `${widthPct}%`,
                      background: `linear-gradient(90deg, #38bdf8, ${preset.accentPrimary})`,
                      boxShadow: `0 0 8px ${preset.accentPrimary}60`,
                    }}
                  />
                </div>
              </div>

              {/* Chevron indicator */}
              <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                <span className="hidden sm:inline text-[11px]">{isExpanded ? "Less Details" : "More Details"}</span>
                {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
              </div>
            </button>

            {/* Collapsible Details Panel */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-t bg-black/20 p-5 space-y-4"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {/* Recommendations */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div
                      className="rounded-2xl p-4 border"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <p className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2 mb-1.5">
                        <FaShirt /> Outfit Recommendation
                      </p>
                      <p className={`text-xs font-bold ${textSecondary}`}>{recommendation.outfit}</p>
                    </div>

                    <div
                      className="rounded-2xl p-4 border"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <p className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2 mb-1.5">
                        <FaPersonRunning /> Outdoor Activity Advisory
                      </p>
                      <p className={`text-xs font-bold ${textSecondary}`}>{recommendation.activity}</p>
                    </div>
                  </div>

                  {/* Metric Chips */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-bold">
                    <div className="rounded-xl p-3 border" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className={`text-[10px] font-black uppercase ${textMuted} flex items-center gap-1`}>
                        <FaWind /> Wind Speed
                      </span>
                      <p className={`mt-1 font-black text-sm ${textPrimary}`}>
                        {Math.round(day.windSpeed * 3.6)} km/h
                      </p>
                    </div>

                    <div className="rounded-xl p-3 border" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className={`text-[10px] font-black uppercase ${textMuted} flex items-center gap-1`}>
                        <FaDroplet /> Precipitation
                      </span>
                      <p className="mt-1 font-black text-sm text-cyan-400">{precipPct}% Chance</p>
                    </div>

                    <div className="rounded-xl p-3 border" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className={`text-[10px] font-black uppercase ${textMuted} flex items-center gap-1`}>
                        <FaGauge /> High Temp
                      </span>
                      <p className={`mt-1 font-black text-sm ${textPrimary}`}>
                        {formatDegrees(day.maxTemp, temperatureUnit)}
                      </p>
                    </div>

                    <div className="rounded-xl p-3 border" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className={`text-[10px] font-black uppercase ${textMuted}`}>Low Temp</span>
                      <p className={`mt-1 font-black text-sm ${textSecondary}`}>
                        {formatDegrees(day.minTemp, temperatureUnit)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SpotlightCard>
        );
      })}
    </div>
  );
}
