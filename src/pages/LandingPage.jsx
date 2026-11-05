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
  FaBolt,
} from "react-icons/fa6";
import { MdOutlineWbSunny } from "react-icons/md";
import Meteors from "../components/reactbits/Meteors";
import ShinyButton from "../components/reactbits/ShinyButton";
import ShinyText from "../components/reactbits/ShinyText";
import SpotlightCard from "../components/reactbits/SpotlightCard";

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
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* ── Aceternity Style Shooting Meteors ── */}
      <Meteors number={22} />

      {/* ── Dynamic Ambient Aurora Gradients ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 -top-32 h-[550px] w-[550px] rounded-full bg-cyan-500 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -right-32 top-1/3 h-[550px] w-[550px] rounded-full bg-indigo-500 blur-[130px]"
        />
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
          {/* Animated Badge */}
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-bold text-cyan-400 border border-cyan-500/25 backdrop-blur-md mb-6 shadow-sm shadow-cyan-500/20"
          >
            <GiSparkles className="h-4 w-4 animate-spin text-cyan-400" style={{ animationDuration: "6s" }} />
            Next-Generation Meteorological Analytics
          </motion.span>

          {/* Metallic Sheen Title */}
          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
            Real-Time <br />
            <ShinyText className="font-black text-transparent bg-clip-text">
              Weather Intelligence
            </ShinyText>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base font-medium text-slate-400 leading-relaxed">
            Experience glassmorphic UI analytics, smart AI outfit recommendations, interactive Leaflet weather radar overlays, Recharts visual trend matrices, and live desktop safety notifications.
          </p>

          {/* Hero CTA — ReactBits ShinyButton */}
          <div className="mt-10 flex justify-center">
            <ShinyButton
              onClick={onExplore}
              className="px-8 py-4 text-sm font-extrabold shadow-2xl shadow-cyan-500/30"
            >
              Explore Live Dashboard{" "}
              <FaArrowRight className="transition-transform group-hover:translate-x-1.5" />
            </ShinyButton>
          </div>
        </motion.div>

        {/* Floating Holographic Hero Preview Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-20 mx-auto max-w-5xl"
        >
          {/* Floating Micro Badge Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.4 },
              x: { duration: 0.8, delay: 0.4 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="hidden sm:flex absolute -top-5 -left-4 z-20 items-center gap-2 rounded-2xl border border-cyan-500/30 bg-slate-900/85 px-4 py-2 text-xs font-bold text-cyan-300 shadow-xl shadow-cyan-500/10 backdrop-blur-xl"
          >
            <FaBolt className="text-amber-400 animate-pulse" /> Real-Time Doppler Sync
          </motion.div>

          {/* Floating Micro Badge Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, y: [0, 7, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.5 },
              x: { duration: 0.8, delay: 0.5 },
              y: { duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
            }}
            className="hidden sm:flex absolute -bottom-5 -right-4 z-20 items-center gap-2 rounded-2xl border border-emerald-500/30 bg-slate-900/85 px-4 py-2 text-xs font-bold text-emerald-300 shadow-xl shadow-emerald-500/10 backdrop-blur-xl"
          >
            <GiSparkles className="text-emerald-400" /> 99.4% AI Accuracy
          </motion.div>

          {/* 3 Levitation Cards with Spotlight Effect */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1: Live Weather */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <SpotlightCard
                className="p-6 border border-white/10 bg-slate-900/70 text-left shadow-2xl"
                spotlightColor="rgba(251, 191, 36, 0.18)"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                    <MdOutlineWbSunny className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black text-emerald-400">
                    LIVE
                  </span>
                </div>
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Weather Card
                </p>
                <h4 className="text-3xl font-black text-white mt-1">24°C</h4>
                <p className="text-xs text-slate-300">Sunny & Clear Sky</p>
              </SpotlightCard>
            </motion.div>

            {/* Card 2: AI Outdoor Score */}
            <motion.div
              animate={{ y: [0, -13, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <SpotlightCard
                className="p-6 border border-cyan-500/30 bg-slate-900/85 text-left shadow-2xl ring-1 ring-cyan-500/30"
                spotlightColor="rgba(6, 182, 212, 0.25)"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                    <GiSparkles className="h-6 w-6 animate-pulse" />
                  </div>
                  <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-black text-cyan-300">
                    OPTIMAL
                  </span>
                </div>
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  AI Outdoor Score
                </p>
                <h4 className="text-3xl font-black text-emerald-400 mt-1">94 / 100</h4>
                <p className="text-xs text-slate-300">Optimal Running Conditions</p>
              </SpotlightCard>
            </motion.div>

            {/* Card 3: Weather Radar */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              <SpotlightCard
                className="p-6 border border-white/10 bg-slate-900/70 text-left shadow-2xl"
                spotlightColor="rgba(99, 102, 241, 0.18)"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-indigo-400/10 flex items-center justify-center text-indigo-400">
                    <FaMapLocationDot className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-black text-indigo-300">
                    RADAR
                  </span>
                </div>
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Weather Radar
                </p>
                <h4 className="text-3xl font-black text-white mt-1">Live Overlays</h4>
                <p className="text-xs text-slate-300">Rain & Wind Layers</p>
              </SpotlightCard>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid with Spotlight Cards */}
      <section className="relative z-10 border-t border-white/10 bg-slate-900/40 py-24 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-black text-white sm:text-4xl">
              Engineered for Weather Precision
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-xl mx-auto">
              Comprehensive atmospheric suite for outdoor planning, real-time Doppler radar, and long-range intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <SpotlightCard
              className="p-8 border border-white/10 bg-slate-900/60 backdrop-blur-xl text-left"
              spotlightColor="rgba(6, 182, 212, 0.18)"
            >
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 shadow-lg shadow-cyan-500/10">
                <GiWindmill className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Dynamic Radar Layers</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Interactive Leaflet maps powered by OpenWeather tiles for real-time rain, cloud, and wind monitoring.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="p-8 border border-white/10 bg-slate-900/60 backdrop-blur-xl text-left"
              spotlightColor="rgba(56, 189, 248, 0.18)"
            >
              <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-5 shadow-lg shadow-sky-500/10">
                <FaCloudRain className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">14-Day Visual Matrix</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Recharts curve splines and precipitation probability matrices for long-range planning.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="p-8 border border-white/10 bg-slate-900/60 backdrop-blur-xl text-left"
              spotlightColor="rgba(16, 185, 129, 0.18)"
            >
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 shadow-lg shadow-emerald-500/10">
                <FaShieldHalved className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Desktop Alerting</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Native Web Notification API integration for storm, high wind, and severe weather safety advisories.
              </p>
            </SpotlightCard>
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
