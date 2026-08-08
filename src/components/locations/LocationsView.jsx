import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaRegStar,
  FaChevronDown,
  FaChevronUp,
  FaTrashCan,
  FaLocationDot,
  FaDroplet,
  FaWind,
  FaMagnifyingGlass,
  FaPlus,
  FaCircleCheck,
} from "react-icons/fa6";
import { WiDaySunny, WiCloud, WiRain, WiThunderstorm, WiSnow, WiFog } from "react-icons/wi";
import MapPanel from "../map/MapPanel";
import { formatTemperature, formatWindSpeed } from "../../utils/units";
import { useThemeContext } from "../../context/ThemeContext";

function WeatherIcon({ main, size = "text-2xl" }) {
  const type = (main || "").toLowerCase();
  if (type.includes("thunder")) return <WiThunderstorm className={`${size} text-amber-400`} />;
  if (type.includes("rain") || type.includes("drizzle")) return <WiRain className={`${size} text-cyan-400`} />;
  if (type.includes("snow")) return <WiSnow className={`${size} text-indigo-300`} />;
  if (type.includes("cloud")) return <WiCloud className={`${size} text-slate-300`} />;
  if (type.includes("mist") || type.includes("fog")) return <WiFog className={`${size} text-slate-400`} />;
  return <WiDaySunny className={`${size} text-amber-400`} />;
}

function LocationAccordionRow({
  loc,
  isActiveCity,
  isExpanded,
  onToggleExpand,
  onSelectLocation,
  onDeleteLocation,
  onToggleFavorite,
  temperatureUnit,
  windSpeedUnit,
  textPrimary,
  textSecondary,
  textMuted,
  preset,
}) {
  const humidity = loc.humidity ?? 55;
  const wind = loc.windSpeed ?? 3.5;
  const aqiProxy = Math.min(150, Math.round((humidity + wind * 4) * 0.7));

  return (
    <div
      className="overflow-hidden rounded-2xl border transition-all duration-200"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderColor: isActiveCity ? preset.accentPrimary : "rgba(255, 255, 255, 0.08)",
        boxShadow: isActiveCity ? `0 0 16px ${preset.accentPrimary}35` : "none",
      }}
    >
      {/* ── Collapsed Row Header ── */}
      <div
        className="flex items-center justify-between p-4 selection:bg-transparent cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Favorite Toggle Star */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(loc.name);
            }}
            className="text-amber-400 hover:scale-125 transition shrink-0 p-1"
            title={loc.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            {loc.isFavorite ? (
              <FaStar size={18} />
            ) : (
              <FaRegStar size={18} className="text-slate-500 hover:text-amber-400" />
            )}
          </button>

          {/* Weather Icon */}
          <WeatherIcon main={loc.mainWeather || loc.condition} />

          {/* City Name & Country */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className={`truncate text-base font-black ${textPrimary}`}>{loc.name}</p>
              {loc.country && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-black border"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#cbd5e1",
                  }}
                >
                  {loc.country}
                </span>
              )}
              {isActiveCity && (
                <span
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black border"
                  style={{
                    backgroundColor: `${preset.accentPrimary}20`,
                    borderColor: `${preset.accentPrimary}40`,
                    color: preset.accentPrimary,
                  }}
                >
                  <FaCircleCheck size={10} /> Active
                </span>
              )}
            </div>
            <p className={`truncate text-xs font-extrabold capitalize ${textSecondary}`}>
              {loc.condition || "Clear"}
            </p>
          </div>
        </div>

        {/* Right side: Temp & Expand Chevron */}
        <div className="flex items-center gap-4 shrink-0">
          <span className={`text-2xl font-black ${textPrimary}`}>
            {formatTemperature(loc.temp, temperatureUnit)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="rounded-xl p-2 transition text-slate-400 hover:bg-white/10 hover:text-white"
            title={isExpanded ? "Collapse Details" : "Expand Details"}
          >
            {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ── Expanded Accordion Details Panel ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t p-5"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.30)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <p
              className="text-xs font-black uppercase tracking-wider mb-3"
              style={{ color: preset.accentPrimary }}
            >
              Granular Weather Metrics — {loc.name}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
              <div
                className="rounded-xl p-3 border"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <span className={`flex items-center gap-1.5 font-bold ${textMuted}`}>
                  <FaDroplet className="text-cyan-400" /> Humidity
                </span>
                <p className={`font-black text-sm mt-1 ${textPrimary}`}>{humidity}%</p>
              </div>

              <div
                className="rounded-xl p-3 border"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <span className={`flex items-center gap-1.5 font-bold ${textMuted}`}>
                  <FaWind className="text-blue-400" /> Wind Speed
                </span>
                <p className={`font-black text-sm mt-1 ${textPrimary}`}>
                  {formatWindSpeed(wind, windSpeedUnit)}
                </p>
              </div>

              <div
                className="rounded-xl p-3 border"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <span className={`flex items-center gap-1.5 font-bold ${textMuted}`}>
                  <FaLocationDot className="text-purple-400" /> Coordinates
                </span>
                <p className={`font-black text-[11px] mt-1 truncate ${textPrimary}`}>
                  {loc.lat ? `${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)}` : "Available"}
                </p>
              </div>

              <div
                className="rounded-xl p-3 border"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <span className={`flex items-center gap-1.5 font-bold ${textMuted}`}>
                  Air Quality Proxy
                </span>
                <p
                  className={`font-black text-sm mt-1 ${
                    aqiProxy < 50
                      ? "text-emerald-400"
                      : aqiProxy < 100
                        ? "text-amber-400"
                        : "text-rose-400"
                  }`}
                >
                  {aqiProxy} AQI
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div
              className="mt-4 flex items-center justify-end gap-3 border-t pt-3"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              {!isActiveCity && (
                <button
                  type="button"
                  onClick={() => onSelectLocation(loc.name)}
                  className="rounded-xl px-4 py-2 text-xs font-black text-white shadow-md transition hover:brightness-110"
                  style={{
                    background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                    boxShadow: `0 0 12px ${preset.accentPrimary}35`,
                  }}
                >
                  Set as Active City ⚡
                </button>
              )}
              <button
                type="button"
                onClick={() => onDeleteLocation(loc.name)}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-black text-rose-400 hover:bg-rose-500/20 transition"
              >
                <FaTrashCan size={12} /> Remove City
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LocationsView({
  weather,
  savedLocations = [],
  onAddLocation,
  onSelectLocation,
  onDeleteLocation,
  onToggleFavorite,
}) {
  const {
    temperatureUnit,
    windSpeedUnit,
    cardBg,
    cardStyle,
    textPrimary,
    textSecondary,
    textMuted,
    preset,
  } = useThemeContext();
  const [query, setQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [expandedCity, setExpandedCity] = useState(null);
  const [status, setStatus] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const city = query.trim();
    if (!city) {
      setStatus("Enter a city name.");
      return;
    }
    setAdding(true);
    setStatus("");
    try {
      const added = await onAddLocation(city);
      setQuery("");
      setStatus(`${added.name} was added to saved locations.`);
    } catch (err) {
      setStatus(
        err?.response?.status === 404
          ? "City not found. Check spelling and try again."
          : "Could not add that city right now.",
      );
    } finally {
      setAdding(false);
    }
  };

  const filteredLocations = useMemo(() => {
    const valid = savedLocations.filter(
      (loc) => loc && typeof loc.name === "string" && loc.name.trim() !== "",
    );
    if (!searchFilter.trim()) return valid;
    const term = searchFilter.toLowerCase();
    return valid.filter(
      (loc) =>
        loc.name.toLowerCase().includes(term) ||
        (loc.country && loc.country.toLowerCase().includes(term)) ||
        (loc.condition && loc.condition.toLowerCase().includes(term)),
    );
  }, [savedLocations, searchFilter]);

  const favorites = useMemo(
    () => filteredLocations.filter((loc) => loc.isFavorite),
    [filteredLocations],
  );
  const recents = useMemo(
    () => filteredLocations.filter((loc) => !loc.isFavorite),
    [filteredLocations],
  );

  return (
    <div className="space-y-6">
      {/* Dynamic Map Header */}
      <MapPanel
        weather={weather}
        locations={filteredLocations}
        onSelectLocation={onSelectLocation}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ── Accordion Saved Locations List ── */}
        <div className={cardBg} style={cardStyle}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className={`text-2xl font-black ${textPrimary}`}>Saved Locations Suite</h2>
              <p className={`text-xs font-bold ${textSecondary}`}>
                Expand any location row for deep atmospheric metrics
              </p>
            </div>

            {/* Filter Input */}
            <div
              className="flex items-center gap-2 rounded-2xl px-3.5 py-2 border backdrop-blur-md"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <FaMagnifyingGlass className={`h-3.5 w-3.5 ${textMuted}`} />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter cities..."
                className={`w-28 sm:w-36 bg-transparent text-xs font-black outline-none ${textPrimary} placeholder:text-slate-500`}
              />
            </div>
          </div>

          {filteredLocations.length === 0 ? (
            <p className={`text-sm font-bold ${textMuted} text-center py-8`}>
              No saved locations found. Add a city using the right panel.
            </p>
          ) : (
            <div className="space-y-6">
              {/* Favorites Category */}
              {favorites.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <FaStar /> Favorites ({favorites.length})
                  </p>
                  <div className="space-y-3">
                    {favorites.map((loc) => (
                      <LocationAccordionRow
                        key={loc.name}
                        loc={loc}
                        isActiveCity={
                          weather?.name?.toLowerCase() === loc.name.toLowerCase()
                        }
                        isExpanded={expandedCity === loc.name}
                        onToggleExpand={() =>
                          setExpandedCity(expandedCity === loc.name ? null : loc.name)
                        }
                        onSelectLocation={onSelectLocation}
                        onDeleteLocation={onDeleteLocation}
                        onToggleFavorite={onToggleFavorite}
                        temperatureUnit={temperatureUnit}
                        windSpeedUnit={windSpeedUnit}
                        textPrimary={textPrimary}
                        textSecondary={textSecondary}
                        textMuted={textMuted}
                        preset={preset}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Locations Category */}
              {recents.length > 0 && (
                <div>
                  <p className={`mb-3 text-xs font-black uppercase tracking-wider ${textMuted}`}>
                    Recent Locations ({recents.length})
                  </p>
                  <div className="space-y-3">
                    {recents.map((loc) => (
                      <LocationAccordionRow
                        key={loc.name}
                        loc={loc}
                        isActiveCity={
                          weather?.name?.toLowerCase() === loc.name.toLowerCase()
                        }
                        isExpanded={expandedCity === loc.name}
                        onToggleExpand={() =>
                          setExpandedCity(expandedCity === loc.name ? null : loc.name)
                        }
                        onSelectLocation={onSelectLocation}
                        onDeleteLocation={onDeleteLocation}
                        onToggleFavorite={onToggleFavorite}
                        temperatureUnit={temperatureUnit}
                        windSpeedUnit={windSpeedUnit}
                        textPrimary={textPrimary}
                        textSecondary={textSecondary}
                        textMuted={textMuted}
                        preset={preset}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Add Location Form ── */}
        <div className={cardBg} style={cardStyle}>
          <h3 className={`text-xl font-black ${textPrimary} flex items-center gap-2`}>
            <FaPlus style={{ color: preset.accentPrimary }} /> Add New Location
          </h3>
          <p className={`mt-1 text-xs font-bold ${textSecondary}`}>
            Save cities for rapid accordion weather monitoring
          </p>

          <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City name or lat,lon..."
              className="w-full rounded-2xl px-4 py-3.5 text-sm font-bold outline-none backdrop-blur-md transition"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.04)",
                color: "#e2e8f0",
              }}
            />

            <button
              type="submit"
              disabled={adding}
              className="w-full rounded-2xl py-3.5 font-black text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                boxShadow: `0 0 20px ${preset.accentPrimary}35`,
              }}
            >
              {adding ? "Searching & Adding..." : "Add to Accordion Suite"}
            </button>
          </form>

          {status && (
            <p className="mt-4 text-xs font-black" style={{ color: preset.accentPrimary }}>
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
