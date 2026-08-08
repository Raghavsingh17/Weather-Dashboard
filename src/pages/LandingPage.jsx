import { motion } from "framer-motion";
import {
  GiSparkles,
  GiWindmill,
} from "react-icons/gi";
import {
  FaCloudRain,
  FaShieldHalved,
  FaArrowRight,
  FaMapLocationDot,
} from "react-icons/fa6";
import { MdOutlineWbSunny } from "react-icons/md";

const TICKER_ITEMS = [
  { city: "London", temp: "16°C", condition: "Light Rain 🌧️" },
  { city: "Tokyo", temp: "22°C", condition: "Clear Sky ☀️" },
  { city: "New York", temp: "19°C", condition: "Partly Cloudy ⛅" },
  { city: "Paris", temp: "18°C", condition: "Mild Breeze 🍃" },
  { city: "Sydney", temp: "24°C", condition: "Sunny ☀️" },
  { city: "Dubai", temp: "36°C", condition: "Hot & Clear 🔥" },
];

export default function LandingPage({ onExplore }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Dynamic Background Mesh Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 lg:px-16 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <GiSparkles className="h-5 w-5 animate-pulse" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Weatherly
          </span>
        </div>
      </header>

      {/* Live Global Ticker */}
      <div className="relative z-10 border-b border-white/10 bg-slate-900/60 py-3 overflow-hidden backdrop-blur-md">
        <div className="flex w-full whitespace-nowrap animate-marquee">
          <div className="flex gap-8 px-4">
            {TICKER_ITEMS.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="font-bold text-white">{item.city}:</span>
                <span className="text-cyan-400 font-extrabold">{item.temp}</span>
                <span>{item.condition}</span>
                <span className="text-slate-600">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center lg:px-12 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-bold text-cyan-400 border border-cyan-500/20 backdrop-blur-md mb-6">
            <GiSparkles className="h-4 w-4" /> Next-Generation Meteorological Analytics
          </span>

          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
            Real-Time <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Weather Intelligence
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base font-medium text-slate-400 leading-relaxed">
            Experience glassmorphic UI analytics, smart AI outfit recommendations, interactive Leaflet weather radar overlays, Recharts visual trend matrices, and live desktop safety notifications.
          </p>

          {/* Hero CTA */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onExplore}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-8 py-4 text-sm font-extrabold text-white shadow-2xl shadow-cyan-500/30 transition-all hover:scale-105"
            >
              Explore Live Dashboard <FaArrowRight />
            </button>
          </div>
        </motion.div>

        {/* Floating Glassmorphic Hero Preview Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white/10 p-6 sm:p-8 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-cyan-500/10"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-900/60 p-5 border border-white/10 text-left">
              <MdOutlineWbSunny className="h-8 w-8 text-amber-400 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Live Weather Card</p>
              <h4 className="text-3xl font-black text-white mt-1">24°C</h4>
              <p className="text-xs text-slate-300">Sunny & Clear Sky</p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-5 border border-white/10 text-left">
              <GiSparkles className="h-8 w-8 text-cyan-400 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">AI Outdoor Score</p>
              <h4 className="text-3xl font-black text-emerald-400 mt-1">94 / 100</h4>
              <p className="text-xs text-slate-300">Optimal Running Conditions</p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-5 border border-white/10 text-left">
              <FaMapLocationDot className="h-8 w-8 text-indigo-400 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase">Weather Radar</p>
              <h4 className="text-3xl font-black text-white mt-1">Live Overlays</h4>
              <p className="text-xs text-slate-300">Rain & Wind Layers</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 border-t border-white/10 bg-slate-900/40 py-20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black text-white sm:text-3xl">Engineered for Weather Precision</h3>
            <p className="text-xs text-slate-400 mt-2">Comprehensive atmospheric suite for outdoor planning</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-8 border border-white/10 backdrop-blur-md">
              <GiWindmill className="h-10 w-10 text-cyan-400 mb-4" />
              <h4 className="text-lg font-bold text-white">Dynamic Radar Layers</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Interactive Leaflet maps powered by OpenWeather tiles for real-time rain, cloud, and wind monitoring.
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-8 border border-white/10 backdrop-blur-md">
              <FaCloudRain className="text-sky-400 h-10 w-10 mb-4" />
              <h4 className="text-lg font-bold text-white">14-Day Visual Matrix</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Recharts curve splines and precipitation probability matrices for long-range planning.
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-8 border border-white/10 backdrop-blur-md">
              <FaShieldHalved className="text-emerald-400 h-10 w-10 mb-4" />
              <h4 className="text-lg font-bold text-white">Desktop Alerting</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Native Web Notification API integration for storm, high wind, and severe weather safety advisories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs font-bold text-slate-500">
        Weatherly • Real-Time Meteorological Dashboard
      </footer>
    </div>
  );
}
