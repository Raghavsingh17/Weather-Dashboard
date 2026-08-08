import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { useThemeContext } from "../../context/ThemeContext";
import ShinyButton from "../reactbits/ShinyButton";


export default function SearchBar({ city, setCity, onSearch }) {
  const { temperatureUnit, updateSetting, preset } = useThemeContext();
  const [prevCity, setPrevCity] = useState(city);
  const [input, setInput] = useState(city || "");

  if (city !== prevCity) {
    setPrevCity(city);
    setInput(city || "");
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setCity(trimmed);
    onSearch(trimmed).catch(() => {});
  };

  const glassStyle = {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.10)",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl p-2.5 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:px-4 sm:py-2 backdrop-blur-xl border transition-all w-full"
      style={glassStyle}
    >
      {/* Mobile Top Row / Desktop Inline: Location Badge & °C/°F Unit Switcher */}
      <div className="flex items-center justify-between gap-2 sm:contents">
        {/* Location Badge */}
        <div
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 max-w-[70%] sm:max-w-none shrink-0"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <MdLocationOn size={16} className="shrink-0" style={{ color: preset.accentPrimary }} />
          <span className="truncate text-xs font-bold text-slate-200">
            {city || "Search City"}
          </span>
        </div>

        {/* Divider (Desktop Only) */}
        <div className="hidden sm:block h-5 w-px shrink-0 bg-white/10" />

        {/* °C / °F Switcher (Mobile Right / Desktop Far Right) */}
        <div
          className="flex shrink-0 items-center gap-0.5 rounded-full p-0.5 sm:p-1 border sm:order-last"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {["celsius", "fahrenheit"].map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => updateSetting("temperatureUnit", unit)}
              className="rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-black transition sm:px-3"
              style={
                temperatureUnit === unit
                  ? {
                      background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                      color: "#fff",
                      boxShadow: `0 0 10px ${preset.accentPrimary}35`,
                    }
                  : { color: "#64748b" }
              }
            >
              {unit === "celsius" ? "°C" : "°F"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Row (Full width on mobile, middle flex-1 on desktop) */}
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-1.5 sm:p-0 bg-white/[0.04] sm:bg-transparent border border-white/[0.07] sm:border-none">
        <FiSearch size={16} className="shrink-0 text-slate-400" />
        <input
          type="search"
          enterKeyHint="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search city..."
          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white outline-none placeholder:text-slate-500 min-w-0"
        />
        <ShinyButton type="submit" className="shrink-0 px-4 py-1.5 text-xs sm:px-6 sm:py-2 sm:text-sm">
          Search
        </ShinyButton>

      </div>
    </form>
  );
}
