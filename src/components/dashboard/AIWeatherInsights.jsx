import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  FaCompass,
  FaShirt,
  FaHeartPulse,
  FaPersonRunning,
  FaPersonBiking,
} from "react-icons/fa6";
import { GiSparkles, GiBinoculars } from "react-icons/gi";
import { MdOutlineLightMode, MdOutlineShieldMoon } from "react-icons/md";
import { useThemeContext } from "../../context/ThemeContext";
import { formatDegrees } from "../../utils/units";

import SpotlightCard from "../reactbits/SpotlightCard";

export default function AIWeatherInsights({ weather, temperatureUnit = "celsius" }) {
  const { innerBg, innerStyle, textPrimary, textSecondary, textMuted, preset } = useThemeContext();


  const temp = weather?.main?.temp ?? 20;
  const humidity = weather?.main?.humidity ?? 50;
  const windSpeed = weather?.wind?.speed ?? 3;
  const condition = weather?.weather?.[0]?.main?.toLowerCase() || "clear";
  const description = weather?.weather?.[0]?.description || "";
  const cloudiness = weather?.clouds?.all ?? 20;

  const isNight = useMemo(() => {
    if (!weather?.sys?.sunset || !weather?.sys?.sunrise) return false;
    const nowSec = weather.dt ?? weather.sys.sunrise + 3600;
    return nowSec > weather.sys.sunset || nowSec < weather.sys.sunrise;
  }, [weather?.dt, weather?.sys?.sunrise, weather?.sys?.sunset]);

  const estimatedUV = useMemo(() => {
    if (isNight) return 0;
    if (cloudiness > 80) return 2;
    if (cloudiness > 40) return 5;
    return 8;
  }, [cloudiness, isNight]);

  const insights = useMemo(() => {
    let score = 100;
    const reasons = [];

    if (temp < 5) { score -= 25; reasons.push("Freezing cold temperatures"); }
    else if (temp < 12) { score -= 10; reasons.push("Chilly weather"); }
    else if (temp > 35) { score -= 30; reasons.push("Extreme heat"); }
    else if (temp > 30) { score -= 15; reasons.push("Hot weather"); }

    if (condition.includes("rain") || condition.includes("drizzle")) { score -= 40; reasons.push("Active precipitation"); }
    else if (condition.includes("snow")) { score -= 35; reasons.push("Snowy conditions"); }
    else if (condition.includes("thunderstorm") || condition.includes("storm")) { score -= 60; reasons.push("Severe thunderstorm activity"); }

    if (windSpeed > 10) { score -= 20; reasons.push("High gusty winds"); }
    else if (windSpeed > 6) { score -= 10; }
    if (humidity > 85) { score -= 10; reasons.push("High humidity"); }

    const finalScore = Math.max(10, Math.min(100, Math.round(score)));

    const running =
      temp >= 10 && temp <= 22 && !condition.includes("rain") && windSpeed < 7
        ? "Optimal"
        : temp > 28 || condition.includes("rain") || windSpeed > 10
          ? "Poor"
          : "Moderate";

    const cycling =
      windSpeed < 6 && !condition.includes("rain") && temp >= 12 && temp <= 28
        ? "Optimal"
        : windSpeed > 9 || condition.includes("rain")
          ? "Poor"
          : "Moderate";

    const stargazing =
      isNight && cloudiness < 25 && !condition.includes("rain")
        ? "Optimal"
        : isNight && cloudiness < 50
          ? "Moderate"
          : "Poor";

    let outfit = "Light cotton shirt, shorts or jeans, and sunglasses.";
    if (temp < 5) outfit = "Heavy winter coat, thermal layers, gloves, and beanie.";
    else if (temp < 14) outfit = "Fleece jacket, long trousers, and closed shoes.";
    else if (temp > 30) outfit = "Breathable linen, hat, sunglasses, and UV sunscreen.";
    if (condition.includes("rain") || condition.includes("drizzle")) outfit += " Carry a waterproof jacket or umbrella.";

    let health = "Great ambient air comfort for outdoor relaxation.";
    if (temp > 32) health = "Stay hydrated and avoid prolonged direct sun exposure.";
    else if (temp < 8) health = "Keep warm to protect against rapid body heat loss.";
    else if (condition.includes("rain")) health = "Watch for slippery surfaces during outdoor commute.";

    return { score: finalScore, outfit, running, cycling, stargazing, health, reasons };
  }, [temp, condition, windSpeed, humidity, cloudiness, isNight]);

  if (!weather) return null;

  const badgeStyle = (status) => {
    if (status === "Optimal") return { backgroundColor: "rgba(16,185,129,0.15)", color: "#34d399", borderColor: "rgba(16,185,129,0.25)" };
    if (status === "Moderate") return { backgroundColor: "rgba(245,158,11,0.15)", color: "#fbbf24", borderColor: "rgba(245,158,11,0.25)" };
    return { backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171", borderColor: "rgba(239,68,68,0.25)" };
  };

  return (
    <SpotlightCard className="p-6">
      <div
        className="flex flex-wrap items-center justify-between gap-4 border-b pb-4"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-md"
            style={{
              background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
              boxShadow: `0 0 16px ${preset.accentPrimary}40`,
            }}
          >
            <GiSparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className={`text-xl font-black ${textPrimary}`}>Smart AI Weather Insights</h3>
            <p className={`text-xs font-bold ${textSecondary}`}>Personalized activity, outfit & health advisory</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={`text-[10px] font-black uppercase tracking-wider ${textMuted}`}>Outdoor Score</p>
            <p className={`text-2xl font-black ${textPrimary}`}>{insights.score}<span className="text-xs text-slate-600">/100</span></p>
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl font-black text-white text-lg shadow-md"
            style={{
              backgroundColor:
                insights.score >= 80 ? "#10b981"
                  : insights.score >= 50 ? "#f59e0b"
                    : "#ef4444",
              boxShadow:
                insights.score >= 80 ? "0 0 16px rgba(16,185,129,0.40)"
                  : insights.score >= 50 ? "0 0 16px rgba(245,158,11,0.40)"
                    : "0 0 16px rgba(239,68,68,0.40)",
            }}
          >
            {insights.score >= 80 ? "A+" : insights.score >= 50 ? "B" : "C"}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {/* Outfit */}
        <div className={innerBg} style={innerStyle}>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider" style={{ color: preset.accentPrimary }}>
            <FaShirt className="h-4 w-4" />
            Outfit Recommendation
          </div>
          <p className={`mt-2 text-xs font-semibold leading-relaxed ${textSecondary}`}>{insights.outfit}</p>
          <div className={`mt-3 flex items-center gap-2 text-[11px] font-bold ${textMuted}`}>
            <span>Current: {formatDegrees(temp, temperatureUnit)}</span>
            <span>•</span>
            <span className="capitalize">{description}</span>
          </div>
        </div>

        {/* Activity */}
        <div className={innerBg} style={innerStyle}>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider" style={{ color: preset.accentSecondary }}>
            <FaCompass className="h-4 w-4" />
            Activity Suitability
          </div>
          <div className="mt-3 space-y-2.5 text-xs">
            {[
              { label: "Running", icon: <FaPersonRunning className="text-amber-400" />, status: insights.running },
              { label: "Cycling", icon: <FaPersonBiking className="text-blue-400" />, status: insights.cycling },
              { label: "Stargazing", icon: <GiBinoculars className="text-indigo-400" />, status: insights.stargazing },
            ].map(({ label, icon, status }) => (
              <div key={label} className="flex items-center justify-between">
                <span className={`flex items-center gap-2 font-semibold ${textSecondary}`}>
                  {icon} {label}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-black border"
                  style={badgeStyle(status)}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Health */}
        <div className={innerBg} style={innerStyle}>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400">
            <FaHeartPulse className="h-4 w-4" />
            Health & Environment
          </div>
          <p className={`mt-2 text-xs font-semibold leading-relaxed ${textSecondary}`}>{insights.health}</p>
          <div className={`mt-3 flex items-center gap-3 text-[11px] font-bold ${textMuted}`}>
            <span className="flex items-center gap-1">
              {isNight ? <MdOutlineShieldMoon /> : <MdOutlineLightMode />}
              UV: {estimatedUV}
            </span>
            <span>•</span>
            <span>Humidity: {humidity}%</span>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

