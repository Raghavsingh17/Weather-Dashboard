/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// 4 Futuristic Dark Neon Theme Presets
// ─────────────────────────────────────────────────────────────────────────────
export const THEMES = {
  cyber: {
    id: "cyber",
    label: "Cyber Emerald & Cyan",
    description: "Dark midnight navy with neon emerald glow",
    // background bases
    bgBase: "#0B132B",
    bgSecondary: "#1C2541",
    // card glass
    cardBgColor: "rgba(19, 28, 49, 0.85)",
    cardBorder: "rgba(30, 41, 59, 0.80)",
    // sidebar
    sidebarBgColor: "rgba(11, 19, 43, 0.92)",
    sidebarBorder: "rgba(255,255,255,0.06)",
    // header
    headerBgColor: "rgba(11, 19, 43, 0.75)",
    headerBorder: "rgba(255,255,255,0.06)",
    // inner panels
    innerBgColor: "rgba(30, 41, 59, 0.60)",
    innerBorder: "rgba(255,255,255,0.06)",
    // accents
    accentPrimary: "#10B981",
    accentSecondary: "#06B6D4",
    accentFrom: "#10B981",
    accentTo: "#06B6D4",
    // orbs
    orb1: "rgba(16,185,129,0.18)",
    orb2: "rgba(6,182,212,0.14)",
    orb3: "rgba(14,165,233,0.10)",
    // text
    dotColor: "#10B981",
  },
  royal: {
    id: "royal",
    label: "Royal Blue & Electric Indigo",
    description: "Deep dark ocean with electric blue pulses",
    bgBase: "#0A0E1A",
    bgSecondary: "#0F172A",
    cardBgColor: "rgba(10, 14, 26, 0.88)",
    cardBorder: "rgba(37, 99, 235, 0.20)",
    sidebarBgColor: "rgba(7, 10, 20, 0.95)",
    sidebarBorder: "rgba(255,255,255,0.06)",
    headerBgColor: "rgba(7, 10, 20, 0.80)",
    headerBorder: "rgba(255,255,255,0.06)",
    innerBgColor: "rgba(15, 23, 42, 0.65)",
    innerBorder: "rgba(99,102,241,0.15)",
    accentPrimary: "#2563EB",
    accentSecondary: "#6366F1",
    accentFrom: "#2563EB",
    accentTo: "#6366F1",
    orb1: "rgba(37,99,235,0.20)",
    orb2: "rgba(99,102,241,0.16)",
    orb3: "rgba(14,165,233,0.10)",
    dotColor: "#2563EB",
  },
  sunset: {
    id: "sunset",
    label: "Sunset Violet & Neon Amber",
    description: "Dark cosmic void with violet aurora accents",
    bgBase: "#0F0C1B",
    bgSecondary: "#1A1030",
    cardBgColor: "rgba(15, 12, 27, 0.88)",
    cardBorder: "rgba(168, 85, 247, 0.20)",
    sidebarBgColor: "rgba(10, 8, 20, 0.95)",
    sidebarBorder: "rgba(255,255,255,0.06)",
    headerBgColor: "rgba(10, 8, 20, 0.80)",
    headerBorder: "rgba(255,255,255,0.06)",
    innerBgColor: "rgba(26, 16, 48, 0.60)",
    innerBorder: "rgba(168,85,247,0.15)",
    accentPrimary: "#A855F7",
    accentSecondary: "#F59E0B",
    accentFrom: "#A855F7",
    accentTo: "#F59E0B",
    orb1: "rgba(168,85,247,0.20)",
    orb2: "rgba(245,158,11,0.15)",
    orb3: "rgba(236,72,153,0.10)",
    dotColor: "#A855F7",
  },
  mint: {
    id: "mint",
    label: "Neon Mint & Lime",
    description: "Deep forest night with bio-neon mint pulses",
    bgBase: "#081C15",
    bgSecondary: "#0D2B1E",
    cardBgColor: "rgba(8, 28, 21, 0.88)",
    cardBorder: "rgba(46, 196, 182, 0.20)",
    sidebarBgColor: "rgba(5, 18, 12, 0.95)",
    sidebarBorder: "rgba(255,255,255,0.06)",
    headerBgColor: "rgba(5, 18, 12, 0.80)",
    headerBorder: "rgba(255,255,255,0.06)",
    innerBgColor: "rgba(13, 43, 30, 0.65)",
    innerBorder: "rgba(46,196,182,0.15)",
    accentPrimary: "#2EC4B6",
    accentSecondary: "#84CC16",
    accentFrom: "#2EC4B6",
    accentTo: "#84CC16",
    orb1: "rgba(46,196,182,0.20)",
    orb2: "rgba(132,204,22,0.15)",
    orb3: "rgba(16,185,129,0.10)",
    dotColor: "#2EC4B6",
  },
};

const defaultSettings = {
  theme: "cyber",           // active THEMES key — replaces old 'accent'
  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",
  notifications: true,
  autoRefresh: true,
  refreshInterval: "15",
};

function loadSettings() {
  try {
    const saved = window.localStorage.getItem("weatherly-settings-v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
    return defaultSettings;
  } catch {
    return defaultSettings;
  }
}

// Inject all CSS variables for the chosen theme preset
function injectThemeVars(preset) {
  const root = document.documentElement;
  root.dataset.theme = "dark"; // always dark futuristic

  root.style.setProperty("--bg-base", preset.bgBase);
  root.style.setProperty("--bg-secondary", preset.bgSecondary);

  root.style.setProperty("--card-bg", preset.cardBgColor);
  root.style.setProperty("--card-border", preset.cardBorder);

  root.style.setProperty("--sidebar-bg", preset.sidebarBgColor);
  root.style.setProperty("--sidebar-border", preset.sidebarBorder);

  root.style.setProperty("--header-bg", preset.headerBgColor);
  root.style.setProperty("--header-border", preset.headerBorder);

  root.style.setProperty("--inner-bg", preset.innerBgColor);
  root.style.setProperty("--inner-border", preset.innerBorder);

  root.style.setProperty("--accent-primary", preset.accentPrimary);
  root.style.setProperty("--accent-secondary", preset.accentSecondary);
  root.style.setProperty("--accent-from", preset.accentFrom);
  root.style.setProperty("--accent-to", preset.accentTo);
  root.style.setProperty(
    "--accent-gradient",
    `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
  );
  root.style.setProperty("--accent-glow", `${preset.accentPrimary}40`);
  root.style.setProperty("--accent-soft", `${preset.accentPrimary}18`);
  root.style.setProperty("--accent-border", `${preset.accentPrimary}35`);

  root.style.setProperty("--orb-1", preset.orb1);
  root.style.setProperty("--orb-2", preset.orb2);
  root.style.setProperty("--orb-3", preset.orb3);
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    const preset = THEMES[settings.theme] || THEMES.cyber;
    injectThemeVars(preset);
    window.localStorage.setItem("weatherly-settings-v2", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    window.localStorage.removeItem("weatherly-settings-v2");
    setSettings({ ...defaultSettings });
  }, []);

  const preset = THEMES[settings.theme] || THEMES.cyber;

  const value = useMemo(
    () => ({
      ...settings,
      isDark: true, // always dark
      preset,

      // Accent helpers
      accentGradient: `from-[${preset.accentFrom}] to-[${preset.accentTo}]`,
      accentGlow: `shadow-[0_0_24px_${preset.accentPrimary}50]`,
      accentRing: `ring-[${preset.accentPrimary}]`,

      // Text helpers
      textPrimary: "text-slate-100",
      textSecondary: "text-slate-400",
      textMuted: "text-slate-500",

      // Dynamic text accent (inline style preferred)
      textAccentColor: preset.accentPrimary,
      textAccentSecondary: preset.accentSecondary,

      // Card class + style helpers — use style for dynamic colors
      cardBg: "rounded-3xl p-6 backdrop-blur-2xl border shadow-2xl",
      cardStyle: {
        backgroundColor: preset.cardBgColor,
        borderColor: preset.cardBorder,
        boxShadow: `0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.04)`,
      },

      innerBg: "rounded-2xl p-4 backdrop-blur-md border",
      innerStyle: {
        backgroundColor: preset.innerBgColor,
        borderColor: preset.innerBorder,
      },

      // Sidebar / header style helpers
      sidebarStyle: {
        backgroundColor: preset.sidebarBgColor,
        borderColor: preset.sidebarBorder,
      },
      headerStyle: {
        backgroundColor: preset.headerBgColor,
        borderColor: preset.headerBorder,
      },

      updateSetting,
      resetSettings,
    }),
    [settings, updateSetting, resetSettings, preset],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
