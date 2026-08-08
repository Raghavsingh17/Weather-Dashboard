import { useThemeContext } from "../../context/ThemeContext";
import SpotlightCard from "../reactbits/SpotlightCard";

export default function WindStatus({ weather }) {
  const { textSecondary, preset } = useThemeContext();

  if (!weather?.wind) return null;

  const windSpeed = weather.wind.speed || 0;
  const windGust = weather.wind.gust || null;
  const windDeg = weather.wind.deg || 0;
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const direction = dirs[Math.round(windDeg / 45) % 8];
  const kmh = Math.round(windSpeed * 3.6);
  const gustKmh = windGust ? Math.round(windGust * 3.6) : null;

  return (
    <SpotlightCard className="p-6">
      <p
        className="text-[10px] font-black uppercase tracking-widest"
        style={{ color: preset.accentPrimary }}
      >
        Wind Velocity & Direction
      </p>

      <div className="mt-4 flex items-center gap-5">
        {/* Animated Compass */}
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <circle cx="50" cy="50" r="44" fill="none" stroke={`${preset.accentPrimary}25`} strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="50" y="15" textAnchor="middle" fill="rgba(255,255,255,0.40)" fontSize="9" fontWeight="bold">N</text>
            <text x="85" y="53" textAnchor="middle" fill="rgba(255,255,255,0.40)" fontSize="9" fontWeight="bold">E</text>
            <text x="50" y="92" textAnchor="middle" fill="rgba(255,255,255,0.40)" fontSize="9" fontWeight="bold">S</text>
            <text x="15" y="53" textAnchor="middle" fill="rgba(255,255,255,0.40)" fontSize="9" fontWeight="bold">W</text>
            <polygon
              points="50,18 43,42 57,42"
              fill={preset.accentPrimary}
              style={{
                transformOrigin: "50px 50px",
                transform: `rotate(${windDeg}deg)`,
                transition: "transform 1s ease-out",
                filter: `drop-shadow(0 0 6px ${preset.accentPrimary}80)`,
              }}
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-1.5">
            <p className="text-4xl font-black text-slate-100">{kmh}</p>
            <span className={`text-xs font-bold ${textSecondary}`}>km/h</span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-extrabold border"
              style={{
                backgroundColor: `${preset.accentPrimary}15`,
                color: preset.accentPrimary,
                borderColor: `${preset.accentPrimary}30`,
              }}
            >
              {direction} ({windDeg}°)
            </span>
          </div>

          {gustKmh && (
            <div
              className="mt-3 rounded-xl p-2 border"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <p className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>
                Peak Gust
              </p>
              <p className="text-sm font-extrabold" style={{ color: preset.accentSecondary }}>{gustKmh} km/h</p>
            </div>
          )}
        </div>
      </div>

      <div
        className="mt-4 h-0.5 w-full rounded-full opacity-30"
        style={{ background: `linear-gradient(90deg, ${preset.accentPrimary}, transparent)` }}
      />
    </SpotlightCard>
  );
}
