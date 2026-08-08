import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiSnow, WiFog } from "react-icons/wi";
import { formatHourlyLabel, getHourlyIntervals } from "../../utils/forecastUtils";
import { formatDegrees, formatTemperature } from "../../utils/units";
import { useThemeContext } from "../../context/ThemeContext";
import SpotlightCard from "../reactbits/SpotlightCard";

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

export default function HourlyForecast({ forecast }) {
  const { temperatureUnit, cardBg, cardStyle, textPrimary, textSecondary, textMuted } = useThemeContext();
  const hourlyItems = getHourlyIntervals(forecast, 24);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (hourlyItems.length === 0) {
    return (
      <div className={`rounded-3xl p-8 text-center ${textMuted}`} style={cardStyle}>
        Hourly forecast unavailable.
      </div>
    );
  }

  return (
    <div className={cardBg} style={cardStyle}>
      {/* Header with Carousel Controls */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>
            Hourly Breakdown
          </p>
          <h2 className={`mt-1 text-2xl font-black ${textPrimary}`}>Next 24 Hours</h2>
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
        {hourlyItems.map((item) => {
          const label = formatHourlyLabel(item);
          const pop = Math.round((item.pop || 0) * 100);
          const hasRain = pop > 0;

          return (
            <div
              key={item.dt}
              className="snap-start shrink-0 w-[85%] min-w-[85%] sm:w-[calc(100%-32px)] sm:min-w-[calc(100%-32px)] md:w-[calc(50%-8px)] md:min-w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] lg:min-w-[calc(33.333%-11px)]"
            >
              <SpotlightCard className="p-5 h-full flex flex-col justify-between">
                <div>
                  <div
                    className="flex items-start justify-between gap-2 border-b pb-3"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div>
                      <p className={`font-black text-sm ${textPrimary}`}>{label.dayName}</p>
                      <p className={`text-xs font-bold ${textMuted}`}>{label.time}</p>
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
                      {formatTemperature(item.main.feels_like, temperatureUnit)}
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
  );
}
