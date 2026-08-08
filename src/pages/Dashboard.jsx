import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdRefresh, MdHome } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

import AlertPanel from "../components/alerts/AlertPanel";
import AirQualityPanel from "../components/airQuality/AirQualityPanel";
import ActivityPlannerView from "../components/activities/ActivityPlannerView";
import WeatherCard from "../components/dashboard/WeatherCard";
import AIWeatherInsights from "../components/dashboard/AIWeatherInsights";
import UVAndWindIntelligence from "../components/dashboard/UVAndWindIntelligence";
import PrecipitationChart from "../components/forecast/PrecipitationChart";
import ForecastView from "../components/forecast/ForecastView";
import BottomNav from "../components/layout/BottomNav";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import LocationsView from "../components/locations/LocationsView";

import SearchBar from "../components/search/SearchBar";
import SettingsView from "../components/settings/SettingsView";
import AuroraBackground from "../components/reactbits/AuroraBackground";
import { useThemeContext } from "../context/ThemeContext";

import { useWeather } from "../hooks/useWeather";
import { useWeatherNotifications } from "../hooks/useWeatherNotifications";

const LOC_KEY = "weatherly-saved-locations";

const DEFAULT_LOCATIONS = [
  {
    name: "Delhi",
    country: "IN",
    temp: 28,
    humidity: 55,
    windSpeed: 3.5,
    condition: "Haze",
    mainWeather: "Clear",
    lat: 28.667,
    lon: 77.217,
    isFavorite: true,
  },
  {
    name: "London",
    country: "GB",
    temp: 16,
    humidity: 72,
    windSpeed: 4.1,
    condition: "Light Rain",
    mainWeather: "Rain",
    lat: 51.507,
    lon: -0.128,
    isFavorite: false,
  },
  {
    name: "Tokyo",
    country: "JP",
    temp: 22,
    humidity: 60,
    windSpeed: 2.8,
    condition: "Clear Sky",
    mainWeather: "Clear",
    lat: 35.676,
    lon: 139.65,
    isFavorite: false,
  },
];

function getStoredLocations() {
  try {
    const data = window.localStorage.getItem(LOC_KEY);
    if (!data) return DEFAULT_LOCATIONS;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_LOCATIONS;
    const valid = parsed.filter(
      (loc) => loc && typeof loc.name === "string" && loc.name.trim() !== ""
    );
    return valid.length > 0 ? valid : DEFAULT_LOCATIONS;
  } catch {
    return DEFAULT_LOCATIONS;
  }
}

function setStoredLocations(locs) {
  try {
    window.localStorage.setItem(LOC_KEY, JSON.stringify(locs));
  } catch {
    // ignore
  }
}

function parseLatLon(val) {
  const parts = val.split(",");
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lon)) return { lat, lon };
  }
  return null;
}

function normalizeWeatherData(data) {
  if (!data) return null;
  const current = data.current || data;
  if (!current || !current.name) return null;
  return {
    name: current.name,
    country: current.sys?.country || "",
    temp: current.main?.temp || 0,
    humidity: current.main?.humidity || 0,
    windSpeed: current.wind?.speed || 0,
    condition: current.weather?.[0]?.description || "",
    mainWeather: current.weather?.[0]?.main || "Clear",
    lat: current.coord?.lat || 0,
    lon: current.coord?.lon || 0,
    isFavorite: false,
  };
}

export default function Dashboard({ initialTab = "overview", onNavigateHome }) {
  const {
    temperatureUnit,
    notifications,
    headerStyle,
    preset,
    textAccentColor,
    autoRefresh,
    refreshInterval,
  } = useThemeContext();

  const {
    city,
    setCity,
    weather,
    forecast,
    alerts,
    loading,
    error,
    fetchWeather,
  } = useWeather("Bangalore");

  useWeatherNotifications(alerts, notifications);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedLocations, setSavedLocations] = useState(getStoredLocations);
  const didLoad = useRef(false);

  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;
    const initialLocation = savedLocations[0]?.name || "Bangalore";
    fetchWeather(initialLocation).catch(() => {});
  }, [fetchWeather, savedLocations]);

  // Auto refresh timer based on autoRefresh & refreshInterval settings
  useEffect(() => {
    if (!autoRefresh || !city) return;
    const intervalMs = Math.max(1, parseInt(refreshInterval, 10) || 15) * 60 * 1000;
    const timer = setInterval(() => {
      fetchWeather(city).catch(() => {});
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval, city, fetchWeather]);


  // Keep active weather synced with saved locations if it exists
  useEffect(() => {
    if (!weather?.name) return;
    setSavedLocations((prev) => {
      const idx = prev.findIndex(
        (loc) => loc.name && loc.name.toLowerCase() === weather.name.toLowerCase()
      );
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        temp: weather.main?.temp || updated[idx].temp,
        humidity: weather.main?.humidity || updated[idx].humidity,
        windSpeed: weather.wind?.speed || updated[idx].windSpeed,
        condition: weather.weather?.[0]?.description || updated[idx].condition,
        mainWeather: weather.weather?.[0]?.main || updated[idx].mainWeather,
      };
      setStoredLocations(updated);
      return updated;
    });
  }, [weather]);

  const handleAddLocation = async (cityName) => {
    const coords = parseLatLon(cityName);
    const result = await fetchWeather(coords ? `${coords.lat},${coords.lon}` : cityName);
    const normalized = normalizeWeatherData(result);

    if (!normalized || !normalized.name) {
      throw new Error("Could not fetch valid weather data for this city.");
    }

    const exists = savedLocations.some(
      (loc) => loc.name && loc.name.toLowerCase() === normalized.name.toLowerCase(),
    );
    const updated = exists
      ? savedLocations.map((loc) =>
          loc.name && loc.name.toLowerCase() === normalized.name.toLowerCase()
            ? { ...loc, ...normalized, isFavorite: loc.isFavorite }
            : loc,
        )
      : [normalized, ...savedLocations];

    setSavedLocations(updated);
    setStoredLocations(updated);
    return normalized;
  };

  const handleSelectLocation = (locationName) => {
    fetchWeather(locationName).catch(() => {});
  };

  const handleDeleteLocation = (locationName) => {
    const updated = savedLocations.filter(
      (loc) => loc.name.toLowerCase() !== locationName.toLowerCase(),
    );
    setSavedLocations(updated);
    setStoredLocations(updated);
  };

  const handleToggleFavorite = (locationName) => {
    const updated = savedLocations.map((loc) =>
      loc.name.toLowerCase() === locationName.toLowerCase()
        ? { ...loc, isFavorite: !loc.isFavorite }
        : loc,
    );
    setSavedLocations(updated);
    setStoredLocations(updated);
  };

  return (
    <AuroraBackground>
      <div className="flex h-screen overflow-hidden font-sans relative">

      {/* ── Animated Neon Orbs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full blur-[130px] transition-all duration-1000"
          style={{ background: "var(--orb-1)" }}
        />
        <div
          className="absolute -right-48 top-1/3 h-[600px] w-[600px] rounded-full blur-[130px] transition-all duration-1000"
          style={{ background: "var(--orb-2)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full blur-[130px] transition-all duration-1000"
          style={{ background: "var(--orb-3)" }}
        />
      </div>

      {/* ── Left Sidebar ── */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        alertCount={alerts.length}
        onRefresh={() => fetchWeather(city).catch(() => {})}
        onNavigateHome={onNavigateHome}
      />

      {/* ── Right Workspace ── */}
      <div className="flex min-w-0 flex-1 flex-col z-10">
        {/* ── Top Navbar ── */}
        <header
          className="sticky top-0 z-30 px-4 py-3 sm:px-6 backdrop-blur-2xl border-b transition-all duration-300"
          style={headerStyle}
        >
          {/* Mobile header row */}
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition"
              aria-label="Open menu"
            >
              <GiHamburgerMenu size={20} />
            </button>

            <span
              onClick={onNavigateHome}
              className="text-sm font-black tracking-wide text-slate-100 cursor-pointer hover:opacity-80 transition"
              title="Return to Landing Page"
            >
              Weatherly
            </span>

            <div className="flex items-center gap-2">
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="rounded-xl p-2 border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition"
                  title="Landing Page"
                >
                  <MdHome size={20} />
                </button>
              )}

              <button
                onClick={() => fetchWeather(city).catch(() => {})}
                className="rounded-xl p-2 border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition"
                title="Refresh"
              >
                <MdRefresh size={20} />
              </button>
            </div>
          </div>

          <SearchBar city={city} setCity={setCity} onSearch={fetchWeather} />
        </header>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          <div className="px-4 pb-8 pt-4 sm:px-6 max-w-7xl mx-auto space-y-5">

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl p-16 text-center backdrop-blur-2xl border"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div
                  className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-t-transparent mb-4"
                  style={{ borderColor: `var(--accent-soft)`, borderTopColor: `var(--accent-primary)` }}
                />
                <p className="text-slate-400 text-sm font-semibold">Fetching live atmospheric data…</p>
              </motion.div>
            )}

            {/* Error Banner */}
            {error && !loading && (
              <div
                className="flex items-center justify-between rounded-2xl border p-4 text-xs font-bold backdrop-blur-md"
                style={{ borderColor: "rgba(239,68,68,0.30)", backgroundColor: "rgba(239,68,68,0.08)", color: "#f87171" }}
              >
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => fetchWeather(city).catch(() => {})}
                  className="rounded-xl px-3 py-1 transition"
                  style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171" }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Tab Content */}
            {!loading && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.22 }}
                >
                  {activeTab === "overview" && (
                    <div className="space-y-5">
                      <WeatherCard weather={weather} />
                      <AIWeatherInsights weather={weather} temperatureUnit={temperatureUnit} />
                      <UVAndWindIntelligence weather={weather} forecast={forecast} />
                      <PrecipitationChart forecast={forecast} temperatureUnit={temperatureUnit} />
                    </div>
                  )}

                  {activeTab === "forecast" && <ForecastView forecast={forecast} />}
                  {activeTab === "air-quality" && <AirQualityPanel weather={weather} />}
                  {activeTab === "activities" && <ActivityPlannerView weather={weather} />}

                  {activeTab === "map" && (
                    <LocationsView
                      weather={weather}
                      savedLocations={savedLocations}
                      onAddLocation={handleAddLocation}
                      onSelectLocation={handleSelectLocation}
                      onDeleteLocation={handleDeleteLocation}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  )}

                  {activeTab === "alerts" && <AlertPanel city={city} alerts={alerts} />}
                  {activeTab === "settings" && <SettingsView />}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Footer */}
            <footer className="mt-10 text-center text-[11px] font-semibold py-4 border-t border-white/5 text-slate-600">
              Weatherly • Real-time Meteorological Suite • Powered by OpenWeather & AI
            </footer>

          </div>
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alertCount={alerts.length}
      />
      </div>
    </AuroraBackground>
  );
}


