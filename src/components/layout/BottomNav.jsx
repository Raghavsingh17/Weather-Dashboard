import { useThemeContext } from "../../context/ThemeContext";
import {
  MdHome,
  MdCloud,
  MdAir,
  MdMap,
  MdNotifications,
  // MdBarChart,
  MdSettings,
} from "react-icons/md";

import { FaCompass } from "react-icons/fa6";

const tabs = [
  { id: "overview", label: "Overview", icon: MdHome },
  { id: "forecast", label: "Forecast", icon: MdCloud },
  { id: "air-quality", label: "Air Quality", icon: MdAir },
  { id: "activities", label: "Activities", icon: FaCompass },
  { id: "map", label: "Maps", icon: MdMap },
  { id: "alerts", label: "Alerts", icon: MdNotifications },
  { id: "settings", label: "Settings", icon: MdSettings },
];

export default function BottomNav({ activeTab, onTabChange, alertCount = 0 }) {
  const { preset } = useThemeContext();

  return (
    /* fixed pill floating above content, centered horizontally */
    <nav className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 lg:hidden">
      <div
        className="flex items-center gap-1 rounded-full px-3 py-2 shadow-2xl backdrop-blur-xl"
        style={{ backgroundColor: "rgba(11,19,43,0.92)", boxShadow: "0 8px 32px rgba(0,0,0,0.60)" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${preset.accentFrom}, ${preset.accentTo})`,
                      boxShadow: `0 4px 12px ${preset.accentPrimary}60`,
                    }
                  : undefined
              }
              className={`relative flex flex-col items-center gap-0.5 rounded-full px-3 py-2 transition-all duration-200 ${
                isActive
                  ? "text-white shadow-md"
                  : "text-slate-600 hover:text-slate-400"
              }`}
            >
              <Icon size={20} />
              {/* show label only on active */}
              {isActive && (
                <span className="text-[9px] font-semibold leading-none">
                  {tab.label}
                </span>
              )}
              {/* alert badge on Alerts tab */}
              {tab.id === "alerts" && alertCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
