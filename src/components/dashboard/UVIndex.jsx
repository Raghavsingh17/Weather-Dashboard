import { useThemeContext } from "../../context/ThemeContext";
import SpotlightCard from "../reactbits/SpotlightCard";

export default function UVIndex({ weather }) {
  const { textSecondary, preset } = useThemeContext();

  if (!weather) return null;

  const getUVIndex = () => {
    const cloudiness = weather.clouds?.all || 0;
    if (!weather.sys?.sunrise || !weather.sys?.sunset) return 0;
    const now = weather.dt || weather.sys.sunrise;
    const isDaytime = now > weather.sys.sunrise && now < weather.sys.sunset;
    if (!isDaytime) return 0;
    return Math.max(0, Math.round(8 * (1 - cloudiness / 100)));
  };

  const uvIndex = getUVIndex();

  const getUVLevel = (uv) => {
    if (uv <= 2) return { level: "Low", color: "#10b981", bg: "from-emerald-500 to-teal-400" };
    if (uv <= 5) return { level: "Moderate", color: "#f59e0b", bg: "from-amber-500 to-yellow-400" };
    if (uv <= 7) return { level: "High", color: "#f97316", bg: "from-orange-500 to-amber-500" };
    if (uv <= 10) return { level: "Very High", color: "#ef4444", bg: "from-rose-500 to-red-500" };
    return { level: "Extreme", color: "#a855f7", bg: "from-purple-500 to-indigo-500" };
  };

  const { level, color, bg } = getUVLevel(uvIndex);

  const desc =
    uvIndex <= 2
      ? "Minimal sun protection required."
      : uvIndex <= 5
        ? "Moderate risk — apply SPF 30+."
        : uvIndex <= 7
          ? "High risk — wear hat & sunglasses."
          : "Very high risk — seek shade 10am–4pm.";

  return (
    <SpotlightCard className="p-6">
      <p
        className="text-[10px] font-black uppercase tracking-widest"
        style={{ color: preset.accentPrimary }}
      >
        UV Radiation Index
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-end gap-3">
          <p className="text-5xl font-black" style={{ color }}>{uvIndex}</p>
          <span className="mb-1 text-sm font-extrabold text-slate-300">{level}</span>
        </div>
        <div className={`h-10 w-2.5 rounded-full bg-gradient-to-t ${bg} shadow-md`} />
      </div>

      <p className={`mt-3 text-xs font-medium leading-relaxed ${textSecondary}`}>{desc}</p>

      {/* Neon divider accent */}
      <div
        className="mt-4 h-0.5 w-full rounded-full opacity-30"
        style={{ background: `linear-gradient(90deg, ${preset.accentPrimary}, transparent)` }}
      />
    </SpotlightCard>
  );
}
