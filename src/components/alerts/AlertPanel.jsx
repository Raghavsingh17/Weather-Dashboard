import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTriangleExclamation,
  FaShieldHalved,
  FaBellSlash,
  FaClock,
  FaCheckDouble,
  FaChevronDown,
  FaChevronUp,
  FaRotateLeft,
} from "react-icons/fa6";
import { useThemeContext } from "../../context/ThemeContext";
import SpotlightCard from "../reactbits/SpotlightCard";

const SAFETY_CHECKLISTS = {
  Rain: [
    "Carry a windproof umbrella and waterproof jacket.",
    "Expect slippery roads & reduced driving visibility.",
    "Keep mobile devices protected from moisture.",
  ],
  Storm: [
    "Avoid outdoor travel and seek shelter immediately.",
    "Stay clear of high trees, tall poles, and metal structures.",
    "Secure loose outdoor furniture and terrace items.",
  ],
  Wind: [
    "Drive cautiously on open highways.",
    "Watch out for falling tree branches or loose debris.",
    "Ensure window shutters and outdoor awnings are secured.",
  ],
  Heat: [
    "Drink plenty of water throughout the day.",
    "Avoid direct sunlight during peak hours (11 AM - 3 PM).",
    "Wear lightweight, light-colored breathable clothing.",
  ],
  Cold: [
    "Dress in insulating thermal layers.",
    "Protect extremities with gloves, beanies, and warm socks.",
    "Watch for black ice on roadways and walkways.",
  ],
};

function getSafetyChecklist(type = "") {
  const t = type.toLowerCase();
  if (t.includes("storm")) return SAFETY_CHECKLISTS.Storm;
  if (t.includes("rain")) return SAFETY_CHECKLISTS.Rain;
  if (t.includes("wind")) return SAFETY_CHECKLISTS.Wind;
  if (t.includes("heat")) return SAFETY_CHECKLISTS.Heat;
  if (t.includes("cold")) return SAFETY_CHECKLISTS.Cold;
  return [
    "Monitor real-time weather updates regularly.",
    "Keep emergency contact numbers handy.",
    "Follow local meteorological guidance.",
  ];
}

export default function AlertPanel({ city, alerts = [] }) {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [snoozedAlerts, setSnoozedAlerts] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { textPrimary, textSecondary, textMuted, preset } = useThemeContext();

  const activeAlerts = alerts.filter(
    (a) => !dismissedAlerts.includes(a.title) && !snoozedAlerts.includes(a.title)
  );

  const dismissAlert = (title) => setDismissedAlerts((prev) => [...prev, title]);
  const snoozeAlert = (title) => setSnoozedAlerts((prev) => [...prev, title]);
  const resetDismissed = () => {
    setDismissedAlerts([]);
    setSnoozedAlerts([]);
  };

  const btnStyle = {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.08)",
    color: "#94a3b8",
  };

  return (
    <SpotlightCard className="p-6 lg:p-8">
      {/* ── Integrated Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 mb-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-ping" />
            <h2 className={`text-2xl font-black ${textPrimary}`}>Weather Safety Alerts</h2>
          </div>
          <p className={`mt-1 text-xs font-extrabold ${textSecondary}`}>
            Real-time automated meteorological warnings for{" "}
            <span className="font-black" style={{ color: preset.accentPrimary }}>{city}</span>
          </p>
        </div>

        {(dismissedAlerts.length > 0 || snoozedAlerts.length > 0) && (
          <button
            type="button"
            onClick={resetDismissed}
            className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black backdrop-blur-md border transition-all hover:bg-white/10"
            style={btnStyle}
          >
            <FaRotateLeft /> Restore Hidden Alerts ({dismissedAlerts.length + snoozedAlerts.length})
          </button>
        )}
      </div>

      {/* ── Active Alerts List or Empty State ── */}
      <AnimatePresence mode="wait">
        {activeAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl p-10 text-center border backdrop-blur-md"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.06)",
              borderColor: "rgba(16, 185, 129, 0.20)",
            }}
          >
            <FaShieldHalved className="mx-auto h-14 w-14 text-emerald-400 mb-3" />
            <h3 className="text-xl font-black text-emerald-400">
              No Active Weather Alerts. Conditions Are Clear.
            </h3>
            <p className={`mt-1 text-xs font-extrabold ${textMuted}`}>
              Current meteorological conditions for <span className="text-slate-200">{city}</span> are within safe, optimal thresholds.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert, idx) => {
              const isExpanded = expandedIndex === idx;
              const checklist = getSafetyChecklist(alert.title);
              const isHigh = alert.severity === "high";

              return (
                <motion.div
                  key={alert.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="rounded-2xl border transition-all duration-200 overflow-hidden"
                  style={{
                    backgroundColor: isHigh ? "rgba(239,68,68,0.06)" : "rgba(245,158,11,0.06)",
                    borderColor: isHigh ? "rgba(239,68,68,0.30)" : "rgba(245,158,11,0.30)",
                  }}
                >
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Alert Info */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-md"
                        style={{ backgroundColor: isHigh ? "#ef4444" : "#f59e0b" }}
                      >
                        <FaTriangleExclamation size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider"
                            style={{
                              backgroundColor: isHigh ? "rgba(239,68,68,0.20)" : "rgba(245,158,11,0.20)",
                              color: isHigh ? "#f87171" : "#fbbf24",
                            }}
                          >
                            {alert.severity} Priority
                          </span>
                          <span className={`text-xs font-bold ${textMuted}`}>• {alert.time}</span>
                        </div>
                        <h3 className={`mt-1 text-base sm:text-lg font-black ${textPrimary}`}>
                          {alert.title}
                        </h3>
                        <p className={`mt-0.5 text-xs font-bold leading-relaxed ${textSecondary}`}>
                          {alert.description}
                        </p>

                        <button
                          type="button"
                          onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                          className="mt-2.5 flex items-center gap-1.5 text-xs font-black hover:underline transition"
                          style={{ color: preset.accentPrimary }}
                        >
                          <span>{isExpanded ? "Hide Safety Checklist" : "View Safety Checklist"}</span>
                          {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </button>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => snoozeAlert(alert.title)}
                        className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition border hover:bg-white/10"
                        style={btnStyle}
                        title="Snooze alert"
                      >
                        <FaClock size={12} /> Snooze
                      </button>
                      <button
                        type="button"
                        onClick={() => dismissAlert(alert.title)}
                        className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition border hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30"
                        style={btnStyle}
                        title="Dismiss alert"
                      >
                        <FaBellSlash size={12} /> Dismiss
                      </button>
                    </div>
                  </div>

                  {/* Expandable Safety Checklist */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t px-5 py-4"
                        style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(0,0,0,0.25)" }}
                      >
                        <p className={`text-xs font-black uppercase tracking-wider ${textMuted} mb-2.5`}>
                          Actionable Preparedness Guidelines:
                        </p>
                        <ul className="space-y-2 text-xs font-semibold">
                          {checklist.map((item, cIdx) => (
                            <li key={cIdx} className={`flex items-start gap-2 ${textSecondary}`}>
                              <FaCheckDouble className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </SpotlightCard>
  );
}
