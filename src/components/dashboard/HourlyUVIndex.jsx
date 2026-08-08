import { motion } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";
import { getHourlyIntervals } from "../../utils/forecastUtils";

export default function HourlyUVIndex({ forecast }) {
  const { cardBg, cardStyle, textSecondary, preset } = useThemeContext();

  if (!forecast?.list) return null;

  const hourlyItems = getHourlyIntervals(forecast, 24);
  if (hourlyItems.length === 0) return null;

  const getHourlyUV = (item) => {
    const hour = new Date(item.dt * 1000).getHours();
    const baseUV = Math.max(0, 8 * Math.cos(((hour - 12) * Math.PI) / 12));
    const cloudiness = item.clouds?.all || 0;
    return Math.max(0, baseUV * (1 - cloudiness / 100));
  };

  const uvData = hourlyItems.map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    uv: getHourlyUV(item),
    hour: new Date(item.dt * 1000).getHours(),
  }));

  const maxUV = Math.max(...uvData.map((d) => d.uv), 1);

  const getUVColor = (uv) => {
    if (uv <= 2) return "#10b981";
    if (uv <= 5) return "#f59e0b";
    if (uv <= 7) return "#f97316";
    if (uv <= 10) return "#ef4444";
    return "#a855f7";
  };

  const getUVLabel = (uv) => {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className={cardBg}
      style={cardStyle}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-[10px] font-black uppercase tracking-widest"
          style={{ color: preset.accentPrimary }}
        >
          UV Index 24-Hour Timeline
        </p>
        <span className="text-[11px] font-bold text-amber-400">Peak Exposure</span>
      </div>

      <div className="mt-4 flex h-28 items-end gap-1.5">
        {uvData.map((d, i) => (
          <div key={i} className="group relative flex flex-1 flex-col items-center">
            <div
              className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-125"
              style={{
                height: `${(d.uv / maxUV) * 100}%`,
                minHeight: "4px",
                backgroundColor: getUVColor(d.uv),
                boxShadow: d.uv > 5 ? `0 0 10px ${getUVColor(d.uv)}66` : "none",
              }}
            />
            {/* Tooltip */}
            <div
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl px-2.5 py-1 text-[10px] font-bold text-white opacity-0 shadow-xl backdrop-blur-md transition-all group-hover:opacity-100 border z-20"
              style={{ backgroundColor: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.10)" }}
            >
              {d.time}: {d.uv.toFixed(1)} ({getUVLabel(d.uv)})
            </div>
            {i % 4 === 0 && (
              <span className={`mt-1 text-[9px] font-medium ${textSecondary}`}>{d.time}</span>
            )}
          </div>
        ))}
      </div>

      <div
        className="mt-3 flex justify-between text-[10px] font-bold border-t pt-2"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="text-emerald-400">Low (0-2)</span>
        <span className="text-amber-400">Mod (3-5)</span>
        <span className="text-orange-400">High (6-7)</span>
        <span className="text-rose-400">VHigh (8-10)</span>
        <span className="text-purple-400">Ext (11+)</span>
      </div>
    </motion.div>
  );
}
