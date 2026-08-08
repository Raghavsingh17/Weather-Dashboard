import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";
import { formatDegrees } from "../../utils/units";

function CustomChartTooltip({ active, payload, temperatureUnit }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div
      className="rounded-2xl p-3 text-xs text-white shadow-2xl backdrop-blur-xl border"
      style={{ backgroundColor: "rgba(10,14,26,0.95)", borderColor: "rgba(255,255,255,0.10)" }}
    >
      <p className="font-bold text-slate-400">{data.fullTime}</p>
      <div className="mt-1 space-y-1">
        <p className="font-semibold text-sky-400">
          Temp: {formatDegrees(data.temp, temperatureUnit)}
        </p>
        <p className="font-semibold text-indigo-400">
          Rain Chance: {data.pop}%
        </p>
        <p className="text-[11px] text-slate-500">Humidity: {data.humidity}%</p>
      </div>
    </div>
  );
}

import SpotlightCard from "../reactbits/SpotlightCard";

export default function PrecipitationChart({ forecast, temperatureUnit = "celsius" }) {
  const { preset } = useThemeContext();

  const chartData = useMemo(() => {
    if (!forecast?.list) return [];
    return forecast.list.slice(0, 8).map((item) => {
      const dateObj = new Date(item.dt * 1000);
      return {
        time: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        fullTime: dateObj.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" }),
        temp: Math.round(item.main.temp),
        pop: Math.round((item.pop || 0) * 100),
        humidity: item.main?.humidity || 0,
      };
    });
  }, [forecast]);

  if (!chartData.length) return null;

  return (
    <SpotlightCard className="p-6">

      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: preset.accentPrimary }}
          >
            Precipitation & Temperature
          </p>
          <h4 className="mt-0.5 text-sm font-bold text-slate-200">
            Next 24-Hour Forecast
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium">
          <span className="flex items-center gap-1" style={{ color: preset.accentPrimary }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: preset.accentPrimary }} /> Temp
          </span>
          <span className="flex items-center gap-1" style={{ color: preset.accentSecondary }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: preset.accentSecondary }} /> Rain %
          </span>
        </div>
      </div>

      <div className="mt-4 h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={preset.accentPrimary} stopOpacity={0.35} />
                <stop offset="95%" stopColor={preset.accentPrimary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={preset.accentSecondary} stopOpacity={0.50} />
                <stop offset="95%" stopColor={preset.accentSecondary} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 10, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
              unit="°"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
              unit="%"
            />
            <Tooltip content={<CustomChartTooltip temperatureUnit={temperatureUnit} />} />
            <Bar yAxisId="right" dataKey="pop" fill="url(#popGrad)" radius={[4, 4, 0, 0]} barSize={14} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              stroke={preset.accentPrimary}
              strokeWidth={2.5}
              fill="url(#tempGrad)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </SpotlightCard>
  );
}

