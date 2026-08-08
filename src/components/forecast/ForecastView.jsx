import { useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiSnow, WiFog } from "react-icons/wi";
import { useThemeContext } from "../../context/ThemeContext";
import { getDailyForecast, getHourlyIntervals } from "../../utils/forecastUtils";
import { formatDegrees } from "../../utils/units";
import TemperatureChart from "./TemperatureChart";
import SpotlightCard from "../reactbits/SpotlightCard";
import DailyForecastInspector from "./DailyForecastInspector";
import WeeklyForecastMatrix from "./WeeklyForecastMatrix";

function ForecastIcon({ main, size = "text-5xl" }) {
  const type = (main || "").toLowerCase();
  if (type.includes("thunder")) return <WiThunderstorm className={`${size}`} style={{ color: "#f59e0b" }} />;
  if (type.includes("rain") || type.includes("drizzle")) return <WiRain className={`${size}`} style={{ color: "#38bdf8" }} />;
  if (type.includes("snow")) return <WiSnow className={`${size}`} style={{ color: "#a5f3fc" }} />;
  if (type.includes("cloud")) return <WiCloud className={`${size}`} style={{ color: "#94a3b8" }} />;
  if (type.includes("mist") || type.includes("fog") || type.includes("haze"))
    return <WiFog className={`${size}`} style={{ color: "#64748b" }} />;
  return <WiDaySunny className={`${size}`} style={{ color: "#fbbf24" }} />;
}

export default function ForecastView({ forecast }) {
  const [timeRange, setTimeRange] = useState("daily");
  const { temperatureUnit, cardBg, cardStyle, textPrimary, textSecondary, textMuted, preset } = useThemeContext();
  const scrollContainerRef = useRef(null);

  const hourly = useMemo(() => getHourlyIntervals(forecast, 48), [forecast]);
  const daily = useMemo(() => getDailyForecast(forecast, 7), [forecast]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const pill = {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.08)",
    color: "#64748b",
  };

  const activePill = {
    background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
    color: "#fff",
    borderColor: "transparent",
    boxShadow: `0 0 16px ${preset.accentPrimary}40`,
  };

  if (!forecast?.list?.length) {
    return (
      <div className={`rounded-3xl p-8 text-center ${textMuted}`} style={cardStyle}>
        Forecast data unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab selector */}
      <div className={`flex flex-wrap gap-3 rounded-3xl p-4 ${cardBg}`} style={cardStyle}>
        {[
          ["hourly", "Hourly Forecast"],
          ["daily", "Daily Forecast"],
          ["weekly", "Weekly Forecast"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTimeRange(key)}
            className="rounded-2xl px-6 py-2.5 font-bold transition-all border text-sm"
            style={timeRange === key ? activePill : pill}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── 1. Hourly Forecast View ── */}
      {timeRange === "hourly" && (
        <>
          <TemperatureChart items={hourly.slice(0, 24)} temperatureUnit={temperatureUnit} />

          <div className={cardBg} style={cardStyle}>
            {/* Header with Arrow Controls */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>
                  Detailed Hourly Breakdown
                </p>
                <h2 className={`mt-1 text-2xl font-black ${textPrimary}`}>Next 48 Hours</h2>
              </div>

              {/* Carousel Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.10)",
                    color: "#f8fafc",
                  }}
                  title="Previous Cards"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.10)",
                    color: "#f8fafc",
                  }}
                  title="Next Cards"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Horizontal Snap Carousel */}
            <div
              ref={scrollContainerRef}
              className="mt-6 flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar py-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {hourly.map((item) => {
                const parts = item.dt_txt?.split(" ") || ["", ""];
                const pop = Math.round((item.pop || 0) * 100);
                const hasRain = pop > 0;

                return (
                  <div
                    key={item.dt}
                    className="snap-start shrink-0 w-[85%] min-w-[85%] sm:w-[calc(100%-32px)] sm:min-w-[calc(100%-32px)] md:w-[calc(50%-8px)] md:min-w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] lg:min-w-[calc(33.333%-11px)]"
                  >
                    <SpotlightCard className="p-5 h-full flex flex-col justify-between">
                      <div>
                        {/* Header: Date/Time + Rain badge */}
                        <div
                          className="flex items-start justify-between gap-2 border-b pb-3"
                          style={{ borderColor: "rgba(255,255,255,0.06)" }}
                        >
                          <div>
                            <p className={`font-black text-sm ${textPrimary}`}>{parts[0]}</p>
                            <p className={`text-xs font-bold ${textMuted}`}>{parts[1]?.slice(0, 5)}</p>
                          </div>
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
                            {pop}% Rain
                          </span>
                        </div>

                        {/* Main Temp & Icon */}
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className={`text-4xl font-black ${textPrimary}`}>
                              {formatDegrees(item.main.temp, temperatureUnit)}
                            </p>
                            <p className={`mt-1 text-xs font-semibold capitalize ${textSecondary}`}>
                              {item.weather?.[0]?.description}
                            </p>
                          </div>
                          <ForecastIcon main={item.weather?.[0]?.main} size="text-5xl" />
                        </div>
                      </div>

                      {/* Footer Metrics */}
                      <div
                        className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t text-xs font-bold"
                        style={{ borderColor: "rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="rounded-xl p-2 border"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.06)",
                          }}
                        >
                          <span className={`text-[10px] font-black uppercase ${textMuted}`}>Feels Like</span>
                          <p className={`font-black mt-0.5 ${textPrimary}`}>
                            {formatDegrees(item.main.feels_like, temperatureUnit)}
                          </p>
                        </div>
                        <div
                          className="rounded-xl p-2 border"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.06)",
                          }}
                        >
                          <span className={`text-[10px] font-black uppercase ${textMuted}`}>Humidity</span>
                          <p className={`font-black mt-0.5 ${textPrimary}`}>{item.main.humidity}%</p>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── 2. Daily Forecast View: Day Inspector Matrix ── */}
      {timeRange === "daily" && <DailyForecastInspector forecast={forecast} />}

      {/* ── 3. Weekly Forecast View: Macro Trend Matrix ── */}
      {timeRange === "weekly" && (
        <div className={cardBg} style={cardStyle}>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Macro Trend Matrix</p>
          <h2 className={`mt-1 text-2xl font-black ${textPrimary} mb-6`}>7-Day Extended Outlook</h2>
          <WeeklyForecastMatrix daily={daily} />
        </div>
      )}
    </div>
  );
}
