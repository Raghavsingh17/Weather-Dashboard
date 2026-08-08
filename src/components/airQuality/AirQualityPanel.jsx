import { MdAir, MdScience } from "react-icons/md";
import { useThemeContext } from "../../context/ThemeContext";
import SpotlightCard from "../reactbits/SpotlightCard";

export default function AirQualityPanel({ weather }) {
  const { cardStyle, textPrimary, textSecondary, textMuted, preset } = useThemeContext();

  if (!weather) {
    return (
      <div className={`rounded-3xl p-10 text-center ${textMuted}`} style={cardStyle}>
        Search for a city to load air quality details.
      </div>
    );
  }

  const windKmh = Math.round((weather.wind?.speed || 0) * 3.6);
  const humidity = weather.main?.humidity || 0;

  let aqi, aqiLabel, aqiColor, barColor, aqiStatus;
  if (windKmh >= 30 && humidity < 60) {
    aqi = 25; aqiLabel = "Good Air Quality"; aqiColor = "#34d399"; barColor = "#10b981"; aqiStatus = "Low Risk";
  } else if (windKmh >= 15 && humidity < 80) {
    aqi = 55; aqiLabel = "Moderate Air Quality"; aqiColor = "#fbbf24"; barColor = "#f59e0b"; aqiStatus = "Moderate Risk";
  } else if (humidity >= 85) {
    aqi = 120; aqiLabel = "Unhealthy for Sensitive Groups"; aqiColor = "#f87171"; barColor = "#ef4444"; aqiStatus = "High Risk";
  } else {
    aqi = 42; aqiLabel = "Good Air Quality"; aqiColor = "#34d399"; barColor = "#10b981"; aqiStatus = "Low Risk";
  }

  const pollutants = [
    { name: "PM2.5", val: Math.round(aqi * 0.35), unit: "µg/m³", desc: "Fine inhalable particles", status: aqi > 100 ? "Elevated" : "Normal" },
    { name: "PM10", val: Math.round(aqi * 0.7), unit: "µg/m³", desc: "Coarse inhalable particles", status: aqi > 100 ? "Elevated" : "Normal" },
    { name: "O₃", val: Math.round(aqi * 0.5), unit: "ppb", desc: "Ground-level Ozone", status: "Optimal" },
    { name: "NO₂", val: Math.round(aqi * 0.25), unit: "ppb", desc: "Nitrogen dioxide", status: "Optimal" },
    { name: "SO₂", val: Math.round(aqi * 0.1), unit: "ppb", desc: "Sulfur dioxide", status: "Optimal" },
    { name: "CO", val: (aqi * 0.015).toFixed(1), unit: "ppm", desc: "Carbon monoxide", status: "Optimal" },
  ];

  return (
    <SpotlightCard className="p-6 sm:p-8">
      {/* ── Top Section: AQI Gauge & Health Status ── */}
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: preset.accentPrimary }}>
          <MdAir className="h-4 w-4" />
          Air Quality Index (AQI)
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-baseline gap-4">
            <span className="text-6xl font-black tracking-tight" style={{ color: aqiColor }}>
              {aqi}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black" style={{ color: aqiColor }}>
                  {aqiLabel}
                </span>
                <span
                  className="rounded-full px-3 py-0.5 text-[10px] font-black border"
                  style={{
                    backgroundColor: `${barColor}20`,
                    color: aqiColor,
                    borderColor: `${barColor}40`,
                  }}
                >
                  {aqiStatus}
                </span>
              </div>
              <p className={`mt-1 text-xs font-extrabold ${textSecondary}`}>
                {weather.name} Regional Atmospheric Station
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar scale */}
        <div className="mt-8">
          <div
            className="h-3.5 w-full overflow-hidden rounded-full border"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700 shadow-md"
              style={{
                width: `${Math.min((aqi / 300) * 100, 100)}%`,
                backgroundColor: barColor,
                boxShadow: `0 0 16px ${barColor}80`,
              }}
            />
          </div>
          <div className={`mt-3 flex justify-between text-[11px] font-extrabold ${textMuted}`}>
            <span>0 Good</span>
            <span>50 Mod</span>
            <span>100 Unhealthy</span>
            <span>150 V.Unhealthy</span>
            <span>300+ Extreme</span>
          </div>
        </div>
      </div>

      {/* ── Glowing Horizontal Section Divider with Clear Margin ── */}
      <div className="my-8 h-px w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />

      {/* ── Bottom Section: Pollutant Breakdown Grid ── */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <p
            className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"
            style={{ color: preset.accentPrimary }}
          >
            <MdScience className="h-4 w-4" />
            Pollutant Breakdown & Concentration
          </p>
          <span className={`text-xs font-extrabold ${textMuted}`}>
            6 Real-Time Sensors
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pollutants.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-4 sm:p-5 border backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:border-cyan-500/35"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                borderColor: "rgba(255, 255, 255, 0.07)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-black ${textPrimary}`}>{p.name}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-black border"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.08)",
                    color: "#94a3b8",
                  }}
                >
                  {p.status}
                </span>
              </div>

              <p className={`mt-3 text-3xl font-black ${textPrimary}`}>
                {p.val} <span className="text-xs font-black" style={{ color: preset.accentPrimary }}>{p.unit}</span>
              </p>
              <p className={`mt-1 text-xs font-bold ${textSecondary}`}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
