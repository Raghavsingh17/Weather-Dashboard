import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";
import { formatHourlyLabel } from "../../utils/forecastUtils";
import { formatDegrees } from "../../utils/units";

function CustomTempTooltip({ active, payload, temperatureUnit }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div
      className="rounded-2xl p-3 text-xs text-white shadow-2xl backdrop-blur-xl border"
      style={{ backgroundColor: "rgba(10,14,26,0.95)", borderColor: "rgba(255,255,255,0.10)" }}
    >
      <p className="font-bold text-slate-400">{data.date} {data.time}</p>
      <div className="mt-1 space-y-1">
        <p className="font-semibold" style={{ color: "var(--accent-primary)" }}>
          Temperature: {formatDegrees(data.temp, temperatureUnit)}
        </p>
        <p className="text-[11px] text-slate-500">Feels Like: {formatDegrees(data.feelsLike, temperatureUnit)}</p>
        <p className="text-[11px]" style={{ color: "var(--accent-secondary)" }}>Precipitation: {data.pop}%</p>
      </div>
    </div>
  );
}

export default function TemperatureChart({ items = [], temperatureUnit = "celsius" }) {
  const { cardBg, cardStyle, textMuted, preset } = useThemeContext();

  const chartData = useMemo(() => {
    return items.map((item) => {
      const { date, time } = formatHourlyLabel(item);
      return {
        time,
        date,
        temp: Math.round(item.temp || item.main?.temp || 0),
        feelsLike: Math.round(item.feelsLike || item.main?.feels_like || 0),
        pop: Math.round((item.pop || 0) * 100),
      };
    });
  }, [items]);

  if (!chartData.length) return null;

  const minTemp = Math.min(...chartData.map((d) => d.temp));
  const maxTemp = Math.max(...chartData.map((d) => d.temp));

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
      className={`mb-6 ${cardBg}`}
      style={cardStyle}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>
            24-Hour Temperature Curve
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-slate-200">
            Hourly Temperature Trend
          </h3>
        </div>
        <div
          className="rounded-full px-3 py-1 text-xs font-bold border"
          style={{
            backgroundColor: `${preset.accentPrimary}12`,
            color: preset.accentPrimary,
            borderColor: `${preset.accentPrimary}25`,
          }}
        >
          Range: {formatDegrees(minTemp, temperatureUnit)} — {formatDegrees(maxTemp, temperatureUnit)}
        </div>
      </div>

      <div className="mt-6 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="mainTempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={preset.accentPrimary} stopOpacity={0.40} />
                <stop offset="95%" stopColor={preset.accentPrimary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={["dataMin - 3", "dataMax + 3"]}
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
              unit="°"
            />
            <Tooltip content={<CustomTempTooltip temperatureUnit={temperatureUnit} />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke={preset.accentPrimary}
              strokeWidth={3}
              fill="url(#mainTempGrad)"
              activeDot={{
                r: 6,
                fill: preset.accentPrimary,
                stroke: "#ffffff",
                strokeWidth: 2,
                filter: `drop-shadow(0 0 6px ${preset.accentPrimary}80)`,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
