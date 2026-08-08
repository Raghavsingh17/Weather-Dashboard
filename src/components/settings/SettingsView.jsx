import { useThemeContext, THEMES } from "../../context/ThemeContext";
import { useWeatherNotifications } from "../../hooks/useWeatherNotifications";
import { FaBell, FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

function Toggle({ checked, onChange, accentPrimary }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex h-8 w-14 items-center rounded-full px-1 transition-all duration-300"
      style={{
        background: checked
          ? `linear-gradient(135deg, ${accentPrimary}, var(--accent-secondary))`
          : "rgba(71,85,105,0.50)",
      }}
      aria-pressed={checked}
    >
      <span
        className={`h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${checked ? "translate-x-6" : "translate-x-0"
          }`}
      />
    </button>
  );
}

export default function SettingsView() {
  const {
    theme,
    windSpeedUnit,
    notifications,
    autoRefresh,
    refreshInterval,
    updateSetting,
    resetSettings,
    cardBg,
    cardStyle,
    textPrimary,
    textSecondary,
    preset,
  } = useThemeContext();

  const { permission, requestPermission, isSupported } = useWeatherNotifications([], notifications);

  const divider = "border-white/5";
  const pillBase = "border border-white/10 text-slate-400 hover:text-slate-200 transition-all";

  return (
    <div className="space-y-6">
      {/* ── Theme Preset Switcher ── */}
      <div className={cardBg} style={cardStyle}>
        <h2 className={`text-2xl font-black ${textPrimary}`}>Visual Theme Preset</h2>
        <p className={`mt-1 text-sm ${textSecondary}`}>
          Switch the entire UI color palette instantly — neon accents, backgrounds, and glow effects all update together.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.values(THEMES).map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => updateSetting("theme", t.id)}
                className="relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300"
                style={{
                  borderColor: isSelected ? t.accentPrimary : "rgba(255,255,255,0.06)",
                  backgroundColor: isSelected
                    ? `${t.accentPrimary}12`
                    : "rgba(255,255,255,0.02)",
                  boxShadow: isSelected ? `0 0 20px ${t.accentPrimary}20` : "none",
                }}
              >
                {/* Color swatch circle */}
                <div
                  className="h-12 w-12 shrink-0 rounded-2xl shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${t.accentFrom}, ${t.accentTo})`,
                    boxShadow: `0 0 16px ${t.accentPrimary}40`,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-slate-100">{t.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                </div>
                {isSelected && (
                  <div
                    className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: t.accentPrimary }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── General Preferences ── */}
      <div className={cardBg} style={cardStyle}>
        <h2 className={`text-2xl font-black ${textPrimary}`}>General Preferences</h2>

        {/* Wind speed */}
        <div className={`mt-6 border-b ${divider} pb-6`}>
          <p className={`mb-3 font-black ${textPrimary}`}>Wind Speed Unit</p>
          <div className="flex flex-wrap gap-3">
            {[
              ["kmh", "km/h"],
              ["mph", "mph"],
              ["ms", "m/s"],
            ].map(([value, lbl]) => (
              <button
                key={value}
                type="button"
                onClick={() => updateSetting("windSpeedUnit", value)}
                className={`rounded-2xl px-5 py-2.5 text-sm font-black transition-all ${pillBase}`}
                style={
                  windSpeedUnit === value
                    ? {
                      background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                      color: "#fff",
                      borderColor: "transparent",
                      boxShadow: `0 0 16px ${preset.accentPrimary}40`,
                    }
                    : { backgroundColor: "rgba(255,255,255,0.03)" }
                }
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notifications & Alerts ── */}
      <div className={cardBg} style={cardStyle}>
        <h2 className={`text-2xl font-black ${textPrimary} flex items-center gap-2`}>
          <FaBell style={{ color: preset.accentPrimary }} /> Notifications & Alerts
        </h2>

        <div className={`mt-6 flex items-center justify-between gap-4 border-b ${divider} pb-6`}>
          <div>
            <p className={`font-black ${textPrimary}`}>Enable Weather Alerts</p>
            <p className={`text-sm font-bold ${textSecondary}`}>
              Generate real-time safety advisories & warnings in the dashboard.
            </p>
          </div>
          <Toggle
            checked={notifications}
            onChange={(v) => updateSetting("notifications", v)}
            accentPrimary={preset.accentPrimary}
          />
        </div>

        {/* Desktop Permission Control */}
        <div className={`flex flex-col gap-3 border-b ${divider} py-6 sm:flex-row sm:items-center sm:justify-between`}>
          <div>
            <p className={`font-black ${textPrimary}`}>Native Desktop Notifications</p>
            <p className={`text-sm font-bold ${textSecondary}`}>
              Receive browser alerts for severe weather (high wind, heavy rain, extreme temp).
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs font-black">
              {permission === "granted" ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <FaCircleCheck /> Desktop Alerts Granted
                </span>
              ) : permission === "denied" ? (
                <span className="flex items-center gap-1 text-rose-400">
                  <FaCircleExclamation /> Notifications Blocked in Browser Settings
                </span>
              ) : (
                <span className="text-amber-400">Permission Required</span>
              )}
            </div>
          </div>

          {permission !== "granted" && isSupported && (
            <button
              type="button"
              onClick={requestPermission}
              className="rounded-2xl px-5 py-2.5 text-xs font-black text-white shadow-lg transition hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                boxShadow: `0 0 20px ${preset.accentPrimary}40`,
              }}
            >
              Enable Browser Alerts 🔔
            </button>
          )}
        </div>

        <div className={`flex items-center justify-between gap-4 border-b ${divider} py-6`}>
          <div>
            <p className={`font-black ${textPrimary}`}>Auto Refresh Data</p>
            <p className={`text-sm font-bold ${textSecondary}`}>
              Automatically poll OpenWeatherMap API while the app is active.
            </p>
          </div>
          <Toggle
            checked={autoRefresh}
            onChange={(v) => updateSetting("autoRefresh", v)}
            accentPrimary={preset.accentPrimary}
          />
        </div>

        {autoRefresh && (
          <div className="pt-6">
            <p className={`mb-3 font-black ${textPrimary}`}>Refresh Frequency</p>
            <div className="flex flex-wrap gap-3">
              {[
                ["15", "15 minutes"],
                ["30", "30 minutes"],
                ["60", "1 hour"],
                ["120", "2 hours"],
              ].map(([val, label]) => {
                const isSelected = String(refreshInterval) === String(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateSetting("refreshInterval", val)}
                    className="rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-black transition-all border"
                    style={
                      isSelected
                        ? {
                          background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                          color: "#ffffff",
                          borderColor: "transparent",
                          boxShadow: `0 0 16px ${preset.accentPrimary}40`,
                        }
                        : {
                          backgroundColor: "rgba(255,255,255,0.03)",
                          borderColor: "rgba(255,255,255,0.08)",
                          color: "#94a3b8",
                        }
                    }
                  >
                    Every {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}


      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={resetSettings}
        className="w-full rounded-2xl py-3.5 font-black text-rose-400 backdrop-blur-md border border-rose-500/15 transition hover:bg-rose-500/10"
        style={{ backgroundColor: "rgba(239,68,68,0.05)" }}
      >
        Reset to Default 🔄
      </button>
    </div>
  );
}
