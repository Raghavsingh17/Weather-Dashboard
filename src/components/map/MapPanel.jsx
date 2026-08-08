import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaCloudRain, FaTemperatureHigh, FaWind, FaCloud } from "react-icons/fa";
import { motion } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function createCustomPin(color = "#6366f1") {
  return L.divIcon({
    className: "custom-map-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 15px ${color};
        animation: pulse 2s infinite;
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 9, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapPanel({ weather, locations = [], onSelectLocation }) {
  const [activeLayer, setActiveLayer] = useState("precipitation_new");
  const { cardBg, cardStyle, innerBg, innerStyle, textPrimary, textSecondary, textMuted, preset } = useThemeContext();

  if (!weather?.coord) {
    return (
      <div className={`text-center ${cardBg}`}>
        Search for a city to load the dynamic weather radar map.
      </div>
    );
  }

  const { lat, lon } = weather.coord;
  const center = [lat, lon];

  const mapLayers = [
    {
      id: "precipitation_new",
      name: "Precipitation",
      icon: FaCloudRain,
    },
    {
      id: "temp_new",
      name: "Temperature",
      icon: FaTemperatureHigh,
    },
    {
      id: "wind_new",
      name: "Wind Speed",
      icon: FaWind,
    },
    {
      id: "clouds_new",
      name: "Cloud Cover",
      icon: FaCloud,
    },
  ];

  const customIcon = createCustomPin(preset.accentPrimary);

  return (
    <motion.div
      whileHover={{ scale: 1.002 }}
      className={`overflow-hidden ${cardBg}`}
      style={cardStyle}
    >
      {/* Header with Layer Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span
            className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm"
            style={{ background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})` }}
          >
            Interactive OpenWeather Radar
          </span>
          <h3 className={`mt-2 text-2xl font-black ${textPrimary}`}>
            Meteorological Map Suite — {weather.name}
          </h3>
        </div>

        {/* Map Layer Switcher Buttons */}
        <div
          className="flex flex-wrap gap-1.5 rounded-2xl p-1.5 border backdrop-blur-md"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          {mapLayers.map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all"
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                        color: "#fff",
                        boxShadow: `0 0 12px ${preset.accentPrimary}40`,
                      }
                    : { color: "#64748b" }
                }
              >
                <Icon size={12} />
                <span>{layer.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Container & Sidebar Details */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Leaflet Map Frame */}
        <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border shadow-inner" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <MapContainer
            center={center}
            zoom={9}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
          >
            <MapController center={center} />

            {/* Base Tile Layer — always dark for futuristic look */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* OpenWeather Weather Overlay Layer */}
            {API_KEY && (
              <TileLayer
                url={`https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
                opacity={0.65}
              />
            )}

            {/* Active City Pin */}
            <Marker position={center} icon={customIcon}>
              <Popup className="custom-popup">
                <div className="p-1 font-sans text-xs">
                  <p className="font-black text-slate-900">{weather.name}</p>
                  <p className="capitalize text-slate-600">{weather.weather?.[0]?.description}</p>
                  <p className="mt-1 font-black text-indigo-600">{Math.round(weather.main?.temp || 0)}°C</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Sidebar Coordinates Info */}
        <div className={`flex flex-col justify-between ${innerBg}`} style={innerStyle}>
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: preset.accentPrimary }}
            >
              Active Coordinates
            </p>
            <h4 className={`mt-1 text-xl font-black ${textPrimary}`}>
              {weather.name}, {weather.sys?.country}
            </h4>
            <p className={`mt-1 text-xs font-bold capitalize ${textSecondary}`}>
              {weather.weather?.[0]?.description}
            </p>


            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div
                className="rounded-xl p-3 border"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
              >
                <span className={`text-[11px] font-black ${textMuted}`}>Latitude</span>
                <p className={`font-black mt-0.5 ${textPrimary}`}>{lat.toFixed(3)}</p>
              </div>
              <div
                className="rounded-xl p-3 border"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
              >
                <span className={`text-[11px] font-black ${textMuted}`}>Longitude</span>
                <p className={`font-black mt-0.5 ${textPrimary}`}>{lon.toFixed(3)}</p>
              </div>
            </div>

            {/* Saved Locations Quick Switcher */}
            {locations.length > 0 && (
              <div className="mt-4">
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-2"
                  style={{ color: preset.accentPrimary }}
                >
                  Quick Location Switch ({locations.length})
                </p>
                <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                  {locations.map((loc) => (
                    <button
                      key={`${loc.name}-${loc.country}`}
                      type="button"
                      onClick={() => onSelectLocation?.(loc.name)}
                      className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition border hover:brightness-125"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        borderColor: "rgba(255,255,255,0.09)",
                      }}
                    >
                      <span className="truncate text-slate-100 font-extrabold">{loc.name}</span>
                      <span className="font-black text-xs" style={{ color: preset.accentPrimary }}>
                        {Math.round(loc.temp)}°C
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex w-full items-center justify-center rounded-xl px-4 py-3 text-xs font-black text-white shadow-md transition hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
              boxShadow: `0 0 16px ${preset.accentPrimary}35`,
            }}
          >
            Open Fullmap Coordinates 🌐
          </a>
        </div>
      </div>
    </motion.div>
  );
}
