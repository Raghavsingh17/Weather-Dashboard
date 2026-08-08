import { useMemo, useState } from "react";
import {
  MdDirectionsRun,
  MdCameraAlt,
  MdForest,
  MdFlight,
  MdSportsSoccer,
  MdBeachAccess,
} from "react-icons/md";
import { WiSunrise, WiSunset } from "react-icons/wi";
import { useThemeContext } from "../../context/ThemeContext";
import SpotlightCard from "../reactbits/SpotlightCard";

const ACTIVITIES = [
  { id: "running", label: "Running & Fitness", icon: MdDirectionsRun },
  { id: "photography", label: "Photography & Golden Hour", icon: MdCameraAlt },
  { id: "stargazing", label: "Camping & Stargazing", icon: MdForest },
  { id: "travel", label: "Travel & Flight", icon: MdFlight },
  { id: "sports", label: "Outdoor Sports", icon: MdSportsSoccer },
  { id: "beach", label: "Beach & Swimming", icon: MdBeachAccess },
];

function calculateActivityScore(activityId, weather) {
  if (!weather) return { score: 75, status: "Good", advice: "Conditions are normal.", metrics: [] };

  const temp = weather.main?.temp || 20;
  const humidity = weather.main?.humidity || 50;
  const windKmh = Math.round((weather.wind?.speed || 0) * 3.6);
  const cloudiness = weather.clouds?.all || 0;
  const mainWeather = (weather.weather?.[0]?.main || "").toLowerCase();

  let score = 85;
  let advice = "";
  const metrics = [];

  // Rain penalty
  if (mainWeather.includes("rain") || mainWeather.includes("drizzle") || mainWeather.includes("thunder")) {
    score -= 40;
    metrics.push({ name: "Precipitation", status: "High Risk", impact: "-40%", color: "#ef4444" });
  } else {
    metrics.push({ name: "Precipitation", status: "Clear (0%)", impact: "Optimal", color: "#34d399" });
  }

  switch (activityId) {
    case "running":
      if (temp > 28) { score -= 20; advice += "High heat — run in early morning or evening. "; }
      else if (temp < 10) { score -= 10; advice += "Chilly — wear thermal layers. "; }
      else advice += "Ideal running temperatures! ";
      if (windKmh > 25) { score -= 15; metrics.push({ name: "Wind Drag", status: `${windKmh} km/h`, impact: "Heavy Drag", color: "#f87171" }); }
      else metrics.push({ name: "Wind Drag", status: `${windKmh} km/h`, impact: "Light Breeze", color: "#34d399" });
      break;

    case "photography":
      if (cloudiness > 80) { score -= 25; advice += "Overcast skies reduce golden hour contrast. "; }
      else advice += "Great lighting conditions for outdoor photography! ";
      metrics.push({ name: "Cloud Diffuser", status: `${cloudiness}% Cover`, impact: cloudiness < 50 ? "Optimal" : "Muffled", color: cloudiness < 50 ? "#34d399" : "#fbbf24" });
      break;

    case "stargazing":
      if (cloudiness > 20) { score -= 40; advice += "Cloud cover obstructs night sky visibility. "; }
      else advice += "Crystal clear skies! Ideal night for stargazing and astronomy. ";
      metrics.push({ name: "Sky Clarity", status: `${100 - cloudiness}% Clear`, impact: cloudiness < 20 ? "Perfect" : "Obstructed", color: cloudiness < 20 ? "#34d399" : "#ef4444" });
      break;

    case "travel":
      if (windKmh > 35) { score -= 30; advice += "High wind speeds may delay flights or highway travel. "; }
      else advice += "Smooth travel conditions expected across routes. ";
      metrics.push({ name: "Route Stability", status: "High", impact: "Safe", color: "#34d399" });
      break;

    case "sports":
      if (temp > 30 || humidity > 80) { score -= 25; advice += "High humidity and heat — stay hydrated. "; }
      else advice += "Great weather for outdoor team sports! ";
      metrics.push({ name: "Heat Index", status: `${temp}°C`, impact: temp < 28 ? "Ideal" : "Elevated", color: temp < 28 ? "#34d399" : "#f59e0b" });
      break;

    case "beach":
      if (temp < 22) { score -= 35; advice += "Water and air temperatures may feel chilly. "; }
      else advice += "Warm sunny weather — perfect for the beach! ";
      metrics.push({ name: "Thermal Comfort", status: `${temp}°C`, impact: temp > 24 ? "Optimal" : "Cool", color: temp > 24 ? "#34d399" : "#fbbf24" });
      break;

    default:
      advice = "Overall good weather conditions.";
  }

  score = Math.max(10, Math.min(100, score));

  let status = "Optimal";
  let statusColor = "#34d399";
  if (score < 40) { status = "Poor"; statusColor = "#ef4444"; }
  else if (score < 70) { status = "Fair"; statusColor = "#fbbf24"; }
  else if (score < 85) { status = "Good"; statusColor = "#38bdf8"; }

  return { score, status, statusColor, advice, metrics };
}

export default function ActivityPlannerView({ weather }) {
  const { cardStyle, textPrimary, textSecondary, textMuted, preset } = useThemeContext();
  const [selectedActivity, setSelectedActivity] = useState("running");

  const activeResult = useMemo(
    () => calculateActivityScore(selectedActivity, weather),
    [selectedActivity, weather]
  );

  if (!weather) {
    return (
      <div className={`rounded-3xl p-10 text-center ${textMuted}`} style={cardStyle}>
        Search for a city to view activity analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Activity Selector Pills ── */}
      <div className="flex flex-wrap gap-3 rounded-3xl p-4 border backdrop-blur-2xl" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
        {ACTIVITIES.map((act) => {
          const Icon = act.icon;
          const isSelected = selectedActivity === act.id;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => setSelectedActivity(act.id)}
              className="flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs sm:text-sm font-black transition-all border cursor-pointer"
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
              <Icon size={18} />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Main Activity Score Card ── */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: preset.accentPrimary }}>
              Activity Suitability Index
            </div>
            <h2 className={`mt-1 text-2xl sm:text-3xl font-black ${textPrimary}`}>
              {ACTIVITIES.find((a) => a.id === selectedActivity)?.label} Rating
            </h2>
            <p className={`mt-2 text-xs font-bold leading-relaxed max-w-xl ${textSecondary}`}>
              {activeResult.advice}
            </p>
          </div>

          {/* Dynamic Score Badge */}
          <div className="flex items-center gap-4 shrink-0 rounded-2xl p-5 border backdrop-blur-md" style={{ backgroundColor: "rgba(0,0,0,0.30)", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="text-center">
              <p className="text-5xl font-black tracking-tight" style={{ color: activeResult.statusColor }}>
                {activeResult.score}%
              </p>
              <span
                className="mt-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-black uppercase border"
                style={{
                  backgroundColor: `${activeResult.statusColor}20`,
                  color: activeResult.statusColor,
                  borderColor: `${activeResult.statusColor}40`,
                }}
              >
                {activeResult.status} Conditions
              </span>
            </div>
          </div>
        </div>

        {/* Impact Metrics Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {activeResult.metrics.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl p-4 border backdrop-blur-md"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black ${textMuted}`}>{m.name}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full border" style={{ color: m.color, borderColor: `${m.color}40`, backgroundColor: `${m.color}15` }}>
                  {m.impact}
                </span>
              </div>
              <p className={`mt-2 text-lg font-black ${textPrimary}`}>{m.status}</p>
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* ── Solar & Astronomical Observatory Hub ── */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: preset.accentPrimary }}>
              Astronomical Observatory
            </p>
            <h3 className={`mt-1 text-xl font-black ${textPrimary}`}>Sun, Moon & Stargazing Arc</h3>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-black border" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#a855f7" }}>
            Stargazing Rating: {weather.clouds?.all < 20 ? "95% Clear" : "Obstructed"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl p-4 border text-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs font-black uppercase text-amber-400">Golden Hour (Morning)</p>
            <p className={`mt-2 text-xl font-black ${textPrimary}`}>05:45 AM – 06:20 AM</p>
            <p className={`mt-1 text-[11px] font-bold ${textMuted}`}>Optimal photography lighting</p>
          </div>

          <div className="rounded-2xl p-4 border text-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs font-black uppercase text-orange-400">Golden Hour (Evening)</p>
            <p className={`mt-2 text-xl font-black ${textPrimary}`}>06:05 PM – 06:40 PM</p>
            <p className={`mt-1 text-[11px] font-bold ${textMuted}`}>Warm sunset glow</p>
          </div>

          <div className="rounded-2xl p-4 border text-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs font-black uppercase text-cyan-400">Blue Hour</p>
            <p className={`mt-2 text-xl font-black ${textPrimary}`}>06:40 PM – 07:05 PM</p>
            <p className={`mt-1 text-[11px] font-bold ${textMuted}`}>Deep twilight sky hue</p>
          </div>

          <div className="rounded-2xl p-4 border text-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-xs font-black uppercase text-purple-400">Moon Phase</p>
            <p className={`mt-2 text-xl font-black ${textPrimary}`}>Waxing Crescent</p>
            <p className={`mt-1 text-[11px] font-bold ${textMuted}`}>32% Illumination</p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
